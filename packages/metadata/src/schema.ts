import { z } from 'zod';

const conditionSchema = z.object({
  prop: z.string().min(1),
  equals: z.unknown().optional(),
  isSet: z.boolean().optional(),
});

export const propertyTypeSchema = z.discriminatedUnion('kind', [
  z.object({ kind: z.literal('string') }),
  z.object({
    kind: z.literal('number'),
    min: z.number().optional(),
    max: z.number().optional(),
    step: z.number().optional(),
  }),
  z.object({ kind: z.literal('boolean') }),
  z.object({ kind: z.literal('enum'), values: z.array(z.string().min(1)).min(1) }),
  z.object({ kind: z.literal('icon') }),
  z.object({ kind: z.literal('object'), schemaRef: z.string().min(1) }),
]);

export const propertySchema = z
  .object({
    name: z.string().regex(/^[a-z][A-Za-z0-9]*$/),
    attribute: z.union([z.string().regex(/^[a-z][a-z0-9-]*$/), z.literal(false)]).optional(),
    reflect: z.boolean().optional(),
    description: z.string().min(1),
    type: propertyTypeSchema,
    default: z.unknown().optional(),
    required: z.boolean().optional(),
    deprecated: z
      .object({
        since: z.string().min(1),
        replacement: z.string().min(1).optional(),
        removalIn: z.string().min(1),
        reason: z.string().min(1),
      })
      .optional(),
    control: z
      .object({
        kind: z.enum(['select', 'radio', 'toggle', 'text', 'number', 'icon-picker']),
        group: z.string().optional(),
      })
      .optional(),
    since: z.string().optional(),
  })
  .superRefine((property, context) => {
    if (
      property.type.kind === 'object' &&
      property.attribute !== undefined &&
      property.attribute !== false
    ) {
      context.addIssue({
        code: 'custom',
        message: 'Object properties cannot be reflected to an attribute',
        path: ['attribute'],
      });
    }
    if (property.type.kind === 'enum' && property.default !== undefined) {
      const allowed = property.type.values;
      if (typeof property.default !== 'string' || !allowed.includes(property.default)) {
        context.addIssue({
          code: 'custom',
          message: 'Default is not one of the allowed values',
          path: ['default'],
        });
      }
    }
  });

const componentConfigSchema: z.ZodType<ComponentConfig> = z.lazy(() =>
  z.object({
    component: z.string().min(1),
    props: z.record(z.string(), z.unknown()).optional(),
    cssProperties: z.record(z.string().regex(/^--uds-/), z.string()).optional(),
    slots: z
      .record(z.string(), z.array(z.union([componentConfigSchema, z.object({ text: z.string() })])))
      .optional(),
    events: z.array(z.string()).optional(),
  }),
);

export interface ComponentConfig {
  component: string;
  props?: Record<string, unknown> | undefined;
  cssProperties?: Record<string, string> | undefined;
  slots?: Record<string, (ComponentConfig | { text: string })[] | undefined> | undefined;
  events?: string[] | undefined;
}

export const componentMetadataSchema = z
  .object({
    schemaVersion: z.literal(1),
    id: z.string().regex(/^[a-z][a-z0-9-]*$/),
    tagName: z.string().regex(/^uds-[a-z0-9-]+$/),
    name: z.string().min(1),
    description: z.string().min(1),
    category: z.enum([
      'actions',
      'forms',
      'navigation',
      'feedback',
      'layout',
      'data-display',
      'overlay',
    ]),
    status: z.enum(['experimental', 'beta', 'stable', 'deprecated']),
    since: z.string().min(1),
    properties: z.array(propertySchema),
    events: z.array(
      z.object({
        name: z.string().regex(/^uds-[a-z0-9-]+$/),
        description: z.string().min(1),
        detail: z.union([z.object({ schemaRef: z.string().min(1) }), z.null()]).optional(),
        cancelable: z.boolean().optional(),
      }),
    ),
    slots: z.array(
      z.object({
        name: z.string(),
        description: z.string().min(1),
        allowedContent: z.string().optional(),
      }),
    ),
    cssParts: z.array(
      z.object({
        name: z.string().min(1),
        description: z.string().min(1),
        stability: z.enum(['stable', 'experimental']),
      }),
    ),
    cssProperties: z.array(
      z.object({
        name: z.string().regex(/^--uds-/),
        description: z.string().min(1),
        token: z.string().optional(),
        syntax: z.string().optional(),
      }),
    ),
    states: z.array(z.object({ name: z.string().min(1), description: z.string().min(1) })),
    constraints: z.array(
      z.object({
        kind: z.enum(['requires', 'forbids']),
        when: conditionSchema,
        then: conditionSchema,
        message: z.string().min(1),
      }),
    ),
    examples: z.array(
      z.object({
        id: z.string().min(1),
        title: z.string().min(1),
        description: z.string().optional(),
        config: componentConfigSchema,
      }),
    ),
    accessibility: z.object({
      role: z.string().min(1),
      keyboard: z.array(z.object({ keys: z.string().min(1), action: z.string().min(1) })),
      requirements: z.array(
        z.object({
          id: z.string().min(1),
          wcag: z.array(z.string().min(1)).min(1),
          description: z.string().min(1),
          verification: z.enum(['automated', 'manual', 'both']),
        }),
      ),
      knownLimitations: z.array(z.string()),
    }),
    responsive: z.object({
      behavior: z.string().min(1),
      containerQueries: z.boolean().optional(),
      notes: z.array(z.string()).optional(),
    }),
  })
  .superRefine((metadata, context) => {
    if (metadata.status === 'stable' && metadata.accessibility.requirements.length === 0) {
      context.addIssue({
        code: 'custom',
        message: 'Stable components need accessibility requirements',
        path: ['accessibility', 'requirements'],
      });
    }
    const names = new Set<string>();
    for (const property of metadata.properties) {
      if (names.has(property.name)) {
        context.addIssue({
          code: 'custom',
          message: `Duplicate property ${property.name}`,
          path: ['properties'],
        });
      }
      names.add(property.name);
    }
  });

export type ComponentMetadata = z.infer<typeof componentMetadataSchema>;
export type PropertyMetadata = z.infer<typeof propertySchema>;

export function componentMetadataJsonSchema(): object {
  return z.toJSONSchema(componentMetadataSchema);
}
