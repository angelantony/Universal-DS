import { spawnSync } from 'node:child_process';
import {
  cpSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { basename, isAbsolute, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(fileURLToPath(new URL('.', import.meta.url)), '../..');
const packsDir = join(root, 'dist/packs');
const manifestPath = join(packsDir, 'manifest.json');
const packageDirs = [
  'packages/tokens',
  'packages/themes',
  'packages/core',
  'packages/metadata',
  'packages/icons',
  'packages/components',
  'packages/react',
  'packages/angular',
  'packages/vue',
];

function readCatalog() {
  const catalog = {};
  let active = false;
  for (const line of readFileSync(join(root, 'pnpm-workspace.yaml'), 'utf8').split('\n')) {
    if (line.startsWith('catalog:')) {
      active = true;
      continue;
    }
    if (active && /^\S/.test(line)) break;
    if (!active) continue;
    const match = /^\s+'?([^':]+)'?:\s+(\S+)/.exec(line);
    if (match?.[1] !== undefined && match[2] !== undefined) catalog[match[1]] = match[2];
  }
  return catalog;
}

function run(command, args, cwd) {
  const result = spawnSync(command, args, { cwd, stdio: 'inherit' });
  if (result.status !== 0) {
    throw new Error(`${command} ${args.join(' ')} failed (${String(result.status)})`);
  }
}

function capture(command, args, cwd) {
  const result = spawnSync(command, args, { cwd, encoding: 'utf8' });
  return {
    status: result.status ?? 1,
    output: `${result.stdout ?? ''}${result.stderr ?? ''}`,
  };
}

function pack() {
  rmSync(packsDir, { recursive: true, force: true });
  mkdirSync(packsDir, { recursive: true });
  /** @type {Map<string, string>} */
  const tarballs = new Map();
  for (const dir of packageDirs) {
    const packageDir = join(root, dir);
    const output = capture('pnpm', ['pack', '--pack-destination', packsDir], packageDir);
    if (output.status !== 0) {
      console.error(output.output);
      throw new Error(`pnpm pack failed in ${dir}`);
    }
    const printed = output.output
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.endsWith('.tgz'))
      .at(-1);
    if (printed === undefined) throw new Error(`pnpm pack printed no tarball for ${dir}`);
    const tarball = existsSync(printed)
      ? printed
      : existsSync(join(packsDir, basename(printed)))
        ? join(packsDir, basename(printed))
        : isAbsolute(printed)
          ? printed
          : join(packageDir, printed);
    const name = JSON.parse(readFileSync(join(packageDir, 'package.json'), 'utf8')).name;
    tarballs.set(name, tarball);
  }
  const catalog = readCatalog();
  for (const tarball of tarballs.values()) rewriteTarball(tarball, tarballs, catalog);
  writeFileSync(manifestPath, `${JSON.stringify(Object.fromEntries(tarballs), null, 2)}\n`);
  console.log(`packed ${String(tarballs.size)} tarballs into ${packsDir}`);
}

function rewriteTarball(tarball, tarballs, catalog) {
  const dir = mkdtempSync(join(tmpdir(), 'uds-pack-'));
  try {
    run('tar', ['-xzf', tarball, '-C', dir], root);
    const pkgPath = join(dir, 'package', 'package.json');
    const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'));
    if (!existsSync(join(dir, 'package', 'dist'))) {
      throw new Error(`${pkg.name} tarball has no dist. Build the package before packing.`);
    }
    for (const field of ['dependencies', 'peerDependencies', 'optionalDependencies']) {
      const deps = pkg[field];
      if (deps === undefined || deps === null) continue;
      for (const [name, version] of Object.entries(deps)) {
        if (name.startsWith('@uds/')) {
          const file = tarballs.get(name);
          if (file === undefined)
            throw new Error(`${pkg.name} depends on ${name}, which was not packed`);
          deps[name] = `file:${file}`;
        } else if (typeof version === 'string' && version.startsWith('catalog:')) {
          const resolved = catalog[name];
          if (resolved === undefined) throw new Error(`No catalog version for ${name}`);
          deps[name] = resolved;
        } else if (typeof version === 'string' && version.startsWith('workspace:')) {
          throw new Error(`${pkg.name} still depends on ${name}@${version}`);
        }
      }
    }
    writeFileSync(pkgPath, `${JSON.stringify(pkg, null, 2)}\n`);
    rmSync(tarball);
    run('tar', ['-czf', tarball, '-C', dir, 'package'], root);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

function loadManifest() {
  if (!existsSync(manifestPath)) throw new Error('Missing dist/packs/manifest.json. Pack first.');
  return new Map(Object.entries(JSON.parse(readFileSync(manifestPath, 'utf8'))));
}

function installDemo(demoDir) {
  const config = JSON.parse(readFileSync(join(demoDir, 'demo.config.json'), 'utf8'));
  const dest = join(root, 'dist/demo-install', config.framework);
  rmSync(dest, { recursive: true, force: true });
  mkdirSync(dest, { recursive: true });
  cpSync(demoDir, dest, {
    recursive: true,
    filter: (source) => {
      const parts = source.slice(demoDir.length).split(/[\\/]/);
      return !parts.some(
        (part) => part === 'node_modules' || part === 'dist' || part === 'out-tsc',
      );
    },
  });
  const original = JSON.parse(readFileSync(join(demoDir, 'package.json'), 'utf8'));
  const catalog = readCatalog();
  const tarballs = loadManifest();
  const resolveDep = (name, version) => {
    if (name.startsWith('@uds/')) {
      const file = tarballs.get(name);
      if (file === undefined) throw new Error(`Demo depends on ${name}, which was not packed`);
      return `file:${file}`;
    }
    if (version === 'catalog:' || version.startsWith('catalog:')) {
      const resolved = catalog[name];
      if (resolved === undefined) throw new Error(`No catalog version for ${name}`);
      return resolved;
    }
    return version;
  };
  const rewrite = (deps) =>
    Object.fromEntries(
      Object.entries(deps ?? {}).map(([name, version]) => [name, resolveDep(name, version)]),
    );
  const installed = {
    name: original.name,
    private: true,
    type: 'module',
    dependencies: rewrite(original.dependencies),
    devDependencies: rewrite(original.devDependencies),
  };
  writeFileSync(join(dest, 'package.json'), `${JSON.stringify(installed, null, 2)}\n`);
  writeFileSync(
    join(dest, 'pnpm-workspace.yaml'),
    'packages:\n  - .\ndangerouslyAllowAllBuilds: true\nminimumReleaseAge: 0\n',
  );
  writeFileSync(join(dest, '.npmrc'), 'node-linker=hoisted\n');
  run('pnpm', ['install', '--prefer-offline'], dest);
  return { dest, config };
}

function packageBin(dest, packageName, binName) {
  const pkgPath = join(dest, 'node_modules', ...packageName.split('/'), 'package.json');
  const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'));
  const relative = typeof pkg.bin === 'string' ? pkg.bin : pkg.bin?.[binName];
  if (typeof relative !== 'string') throw new Error(`${packageName} has no bin ${binName}`);
  return join(dest, 'node_modules', ...packageName.split('/'), relative);
}

function typecheck(dest, framework) {
  const tsc = packageBin(dest, 'typescript', 'tsc');
  if (framework === 'vue') {
    run(
      'node',
      [
        packageBin(dest, 'vue-tsc', 'vue-tsc'),
        '-p',
        'tsconfig.app.json',
        '--noEmit',
        '--pretty',
        'false',
      ],
      dest,
    );
  } else if (framework === 'angular') {
    run(
      'node',
      [
        packageBin(dest, '@angular/compiler-cli', 'ngc'),
        '-p',
        'tsconfig.app.json',
        '--pretty',
        'false',
      ],
      dest,
    );
  } else {
    run('node', [tsc, '-p', 'tsconfig.app.json', '--noEmit', '--pretty', 'false'], dest);
  }

  const invalid =
    framework === 'vue'
      ? capture(
          'node',
          [
            packageBin(dest, 'vue-tsc', 'vue-tsc'),
            '-p',
            'tsconfig.invalid.json',
            '--noEmit',
            '--pretty',
            'false',
          ],
          dest,
        )
      : framework === 'angular'
        ? capture(
            'node',
            [
              packageBin(dest, '@angular/compiler-cli', 'ngc'),
              '-p',
              'tsconfig.invalid.json',
              '--pretty',
              'false',
            ],
            dest,
          )
        : capture(
            'node',
            [tsc, '-p', 'tsconfig.invalid.json', '--noEmit', '--pretty', 'false'],
            dest,
          );
  if (invalid.status === 0) throw new Error(`${framework} accepted variant "nope"`);
  if (!invalid.output.includes('nope')) {
    console.error(invalid.output);
    throw new Error(`${framework} rejected the fixture, but not because of "nope"`);
  }
  if (invalid.output.includes('TS2307') || invalid.output.includes('Cannot find module')) {
    console.error(invalid.output);
    throw new Error(`${framework} invalid fixture failed to resolve modules`);
  }
  console.log(`${framework} types reject variant "nope"`);
}

function copySources(demoDir, dest) {
  cpSync(demoDir, dest, {
    recursive: true,
    filter: (source) => {
      const relative = source.slice(demoDir.length).replaceAll('\\', '/');
      if (
        relative === '/package.json' ||
        relative === '/pnpm-workspace.yaml' ||
        relative === '/.npmrc'
      ) {
        return false;
      }
      return !relative
        .split('/')
        .some((part) => part === 'node_modules' || part === 'dist' || part === 'out-tsc');
    },
  });
}

function e2e(demoDir, dest) {
  copySources(demoDir, dest);
  run(
    'node',
    [packageBin(dest, '@playwright/test', 'playwright'), 'test', '--config=playwright.demo.ts'],
    dest,
  );
}

const [action] = process.argv.slice(2);
if (action === 'pack') {
  pack();
} else if (action === 'typecheck' || action === 'e2e') {
  const demoDir = process.cwd();
  const config = JSON.parse(readFileSync(join(demoDir, 'demo.config.json'), 'utf8'));
  const dest = join(root, 'dist/demo-install', config.framework);
  if (action === 'typecheck' || !existsSync(join(dest, 'node_modules'))) installDemo(demoDir);
  if (action === 'typecheck') typecheck(dest, config.framework);
  else e2e(demoDir, dest);
} else {
  throw new Error('Use: verify.mjs pack | typecheck | e2e');
}
