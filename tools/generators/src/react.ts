import type { ComponentMetadata } from '@uds/metadata';
import { className, generatedBanner, propertyTsType, reactEventName } from './names.js';

export function reactComponentSource(metadata: ComponentMetadata): string {
  const name = className(metadata.id);
  const events =
    metadata.events.length === 0
      ? ''
      : `,\n  events: {\n${metadata.events
          .map((event) => `    ${reactEventName(event.name)}: '${event.name}',`)
          .join('\n')}\n  }`;
  return `${generatedBanner}
import { createComponent } from '@lit/react';
import * as React from 'react';
import { ${name} as ${name}Element } from '@uds/components/${metadata.id}/class';
import '@uds/components/${metadata.id}';

export const ${name} = createComponent({
  displayName: '${name}',
  elementClass: ${name}Element,
  react: React,
  tagName: '${metadata.tagName}'${events},
});
`;
}

export function reactJsxSource(components: readonly ComponentMetadata[]): string {
  const imports = components
    .map((metadata) => {
      const name = className(metadata.id);
      return `import type { ${name} as ${name}Element } from '@uds/components/${metadata.id}/class';`;
    })
    .join('\n');
  const aliases = components
    .map((metadata) => {
      const name = className(metadata.id);
      const fields = metadata.properties
        .map((property) => `  ${property.name}?: ${propertyTsType(property)};`)
        .join('\n');
      return `type ${name}Jsx = React.DetailedHTMLProps<
  React.HTMLAttributes<${name}Element>,
  ${name}Element
> & {
${fields}
};`;
    })
    .join('\n\n');
  const elements = components
    .map((metadata) => `    '${metadata.tagName}': ${className(metadata.id)}Jsx;`)
    .join('\n');
  return `${generatedBanner}
import type * as React from 'react';
${imports}

${aliases}

export {};

declare module 'react' {
  // JSX intrinsic elements are declared as a namespace.
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
${elements}
    }
  }
}
`;
}

export function reactGeneratedIndex(components: readonly ComponentMetadata[]): string {
  const lines = components.map((metadata) => {
    const name = className(metadata.id);
    return `export { ${name} } from './${metadata.id}.js';`;
  });
  return `${generatedBanner}\n${lines.join('\n')}\n`;
}

export function reactPackageIndex(components: readonly ComponentMetadata[]): string {
  const names = components.map((metadata) => className(metadata.id)).join(', ');
  return `${generatedBanner}
import './generated/jsx.js';

export { ${names} } from './generated/index.js';
`;
}
