import { componentMetadataSchema, type ComponentMetadata } from './schema.js';

export interface ComponentRegistry {
  all(): readonly ComponentMetadata[];
  get(id: string): ComponentMetadata | undefined;
  getByTag(tagName: string): ComponentMetadata | undefined;
  byCategory(category: ComponentMetadata['category']): readonly ComponentMetadata[];
}

export function createRegistry(entries: readonly unknown[]): ComponentRegistry {
  const byId = new Map<string, ComponentMetadata>();
  const byTag = new Map<string, ComponentMetadata>();
  for (const entry of entries) {
    const metadata = componentMetadataSchema.parse(entry);
    if (byId.has(metadata.id)) throw new Error(`Duplicate component id "${metadata.id}"`);
    if (byTag.has(metadata.tagName)) throw new Error(`Duplicate tag "${metadata.tagName}"`);
    byId.set(metadata.id, metadata);
    byTag.set(metadata.tagName, metadata);
  }
  return {
    all: () => [...byId.values()],
    get: (id) => byId.get(id),
    getByTag: (tagName) => byTag.get(tagName),
    byCategory: (category) => [...byId.values()].filter((item) => item.category === category),
  };
}
