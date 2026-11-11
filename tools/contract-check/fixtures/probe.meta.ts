import type { ComponentMetadata } from '@uds/metadata';

export const probeMetadata = {
  schemaVersion: 1,
  id: 'probe',
  tagName: 'uds-probe',
  name: 'Probe',
  description: 'Fixture used to verify the metadata contract check.',
  category: 'feedback',
  status: 'experimental',
  since: '0.0.0',
  properties: [
    {
      name: 'variant',
      attribute: 'variant',
      reflect: true,
      description: 'Visual variant.',
      type: { kind: 'enum', values: ['alpha', 'beta'] },
      default: 'alpha',
    },
    {
      name: 'disabled',
      attribute: 'disabled',
      reflect: true,
      description: 'Disables the element.',
      type: { kind: 'boolean' },
      default: false,
    },
  ],
  events: [{ name: 'uds-probe', description: 'Emitted when the probe activates.', detail: null }],
  slots: [
    { name: '', description: 'Default content.' },
    { name: 'icon', description: 'Optional icon.' },
  ],
  cssParts: [{ name: 'base', description: 'Outer wrapper.', stability: 'experimental' }],
  cssProperties: [{ name: '--uds-probe-color', description: 'Text color.' }],
  states: [{ name: 'disabled', description: 'The element does not activate.' }],
  constraints: [],
  examples: [
    {
      id: 'default',
      title: 'Default',
      config: { component: 'probe', props: { variant: 'alpha' } },
    },
  ],
  accessibility: {
    role: 'generic',
    keyboard: [],
    requirements: [
      {
        id: 'name',
        wcag: ['4.1.2'],
        description: 'Fixture only. Not shipped.',
        verification: 'manual',
      },
    ],
    knownLimitations: ['This fixture is not a supported component.'],
  },
  responsive: { behavior: 'Stretches to the available inline size.' },
} satisfies ComponentMetadata;
