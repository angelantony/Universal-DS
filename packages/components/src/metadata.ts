import { componentMetadataSchema, type ComponentMetadata } from '@uds/metadata';
import { buttonMetadata } from './button/button.meta.js';

/** Components whose adapters are generated. Add a metadata object here, then regenerate. */
export const componentCatalog: readonly ComponentMetadata[] = [buttonMetadata];

export function parseButtonMetadata(value: unknown = buttonMetadata): ComponentMetadata {
  return componentMetadataSchema.parse(value);
}

export { buttonMetadata };
