import type { ComponentMetadata } from '@uds/metadata';
import {
  angularOutputName,
  className,
  generatedBanner,
  isFormValue,
  propertyDefault,
  propertyTsType,
} from './names.js';

export function angularComponentSource(metadata: ComponentMetadata): string {
  const name = className(metadata.id);
  const form = isFormValue(metadata);
  const hasBoolean = metadata.properties.some((property) => property.type.kind === 'boolean');
  const core = [
    ...(hasBoolean ? ['booleanAttribute'] : []),
    'Directive',
    'ElementRef',
    'effect',
    'inject',
    'input',
    ...(metadata.events.length > 0 ? ['output'] : []),
    ...(form ? ['forwardRef'] : []),
  ];

  const inputs = metadata.properties
    .map((property) => {
      if (property.type.kind === 'boolean') {
        return `  readonly ${property.name} = input(${propertyDefault(property)}, { transform: booleanAttribute });`;
      }
      return `  readonly ${property.name} = input<${propertyTsType(property)}>(${propertyDefault(property)});`;
    })
    .join('\n');

  const assignments = metadata.properties
    .map((property) => `      element.${property.name} = this.${property.name}();`)
    .join('\n');

  const outputs = metadata.events
    .map((event) => `  readonly ${angularOutputName(event.name)} = output<Event>();`)
    .join('\n');

  const handlers = metadata.events
    .map((event) => {
      const output = angularOutputName(event.name);
      const notify = form ? '\n    this.notifyValue();' : '';
      return `  emit${output.charAt(0).toUpperCase()}${output.slice(1)}(event: Event): void {
    this.${output}.emit(event);${notify}
  }`;
    })
    .join('\n\n');

  const host =
    metadata.events.length === 0
      ? ''
      : `
    host: {
${metadata.events
  .map((event) => {
    const output = angularOutputName(event.name);
    const method = `emit${output.charAt(0).toUpperCase()}${output.slice(1)}`;
    return `      '(${event.name})': '${method}($event)',`;
  })
  .join('\n')}
    },`;

  const providers = form
    ? `
    providers: [
      {
        multi: true,
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => ${name}),
      },
    ],`
    : '';

  const formFields = form
    ? `
  private onChange: (value: unknown) => void = () => undefined;
  private onTouched: () => void = () => undefined;

  writeValue(value: unknown): void {
    Reflect.set(this.host.nativeElement, 'value', value);
  }

  registerOnChange(fn: (value: unknown) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(disabled: boolean): void {
    Reflect.set(this.host.nativeElement, 'disabled', disabled);
  }

  private notifyValue(): void {
    this.onChange(Reflect.get(this.host.nativeElement, 'value'));
    this.onTouched();
  }
`
    : '';

  const implementsClause = form ? ' implements ControlValueAccessor' : '';
  const formsImport = form
    ? `import { NG_VALUE_ACCESSOR } from '@angular/forms';
import type { ControlValueAccessor } from '@angular/forms';
`
    : '';

  return `${generatedBanner}
import { ${core.join(', ')} } from '@angular/core';
${formsImport}import type { ${name} as ${name}Element } from '@uds/components/${metadata.id}/class';
import '@uds/components/${metadata.id}';

@Directive({
  selector: '${metadata.tagName}',${providers}${host}
})
export class ${name}${implementsClause} {
  private readonly host = inject(ElementRef) as ElementRef<${name}Element>;

${inputs}
${outputs === '' ? '' : `\n${outputs}\n`}
  constructor() {
    const host = this.host;
    effect(() => {
      const element = host.nativeElement;
${assignments}
    });
  }
${handlers === '' ? '' : `\n${handlers}\n`}${formFields}}
`;
}

export function angularGeneratedIndex(components: readonly ComponentMetadata[]): string {
  const lines = components.map((metadata) => {
    const name = className(metadata.id);
    return `export { ${name} } from './${metadata.id}.js';`;
  });
  return `${generatedBanner}\n${lines.join('\n')}\n`;
}

export function angularPackageIndex(components: readonly ComponentMetadata[]): string {
  const names = components.map((metadata) => className(metadata.id)).join(', ');
  return `${generatedBanner}
export { ${names} } from './generated/index.js';
`;
}
