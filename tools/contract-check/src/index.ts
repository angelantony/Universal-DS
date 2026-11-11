import { componentMetadataSchema, type ComponentMetadata } from '@uds/metadata';

export { contractDifferences, type PublicContract } from './compare.js';
export { extractContract } from './extract.js';

export function parseMetadata(value: unknown): ComponentMetadata {
  return componentMetadataSchema.parse(value);
}
