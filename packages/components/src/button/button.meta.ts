import type { ComponentMetadata } from '@uds/metadata';

export const buttonVariants = [
  'primary',
  'secondary',
  'tertiary',
  'outline',
  'ghost',
  'text',
  'custom',
] as const;
export const buttonTones = ['neutral', 'danger', 'success', 'warning'] as const;
export const buttonSizes = ['xs', 'sm', 'md', 'lg', 'xl', 'custom'] as const;
export const buttonTypes = ['button', 'submit', 'reset'] as const;

export type ButtonVariant = (typeof buttonVariants)[number];
export type ButtonTone = (typeof buttonTones)[number];
export type ButtonSize = (typeof buttonSizes)[number];
export type ButtonType = (typeof buttonTypes)[number];

const cssProperty = (name: string, description: string, token?: string) => ({
  name,
  description,
  ...(token === undefined ? {} : { token }),
});

export const buttonMetadata = {
  schemaVersion: 1,
  id: 'button',
  tagName: 'uds-button',
  name: 'Button',
  description:
    'Action control. Emphasis (variant) and meaning (tone) are separate axes. Visual values are public CSS custom properties.',
  category: 'actions',
  status: 'beta',
  since: '0.0.0',
  properties: [
    {
      name: 'variant',
      attribute: 'variant',
      reflect: true,
      description: 'Visual emphasis. custom leaves the color pair to the consumer.',
      type: { kind: 'enum', values: [...buttonVariants] },
      default: 'primary',
      control: { kind: 'select', group: 'appearance' },
    },
    {
      name: 'tone',
      attribute: 'tone',
      reflect: true,
      description: 'Semantic meaning, independent from emphasis.',
      type: { kind: 'enum', values: [...buttonTones] },
      default: 'neutral',
      control: { kind: 'select', group: 'appearance' },
    },
    {
      name: 'size',
      attribute: 'size',
      reflect: true,
      description:
        'Control size. custom keeps the public size properties as the consumer sets them.',
      type: { kind: 'enum', values: [...buttonSizes] },
      default: 'md',
      control: { kind: 'select', group: 'appearance' },
    },
    {
      name: 'type',
      attribute: 'type',
      reflect: true,
      description: 'button does not submit. submit and reset act on the light-DOM form.',
      type: { kind: 'enum', values: [...buttonTypes] },
      default: 'button',
      control: { kind: 'radio', group: 'behavior' },
    },
    {
      name: 'disabled',
      attribute: 'disabled',
      reflect: true,
      description: 'Native disabled. The control is removed from the tab order.',
      type: { kind: 'boolean' },
      default: false,
      control: { kind: 'toggle', group: 'state' },
    },
    {
      name: 'loading',
      attribute: 'loading',
      reflect: true,
      description: 'Blocks activation, keeps focus, and sets aria-busy.',
      type: { kind: 'boolean' },
      default: false,
      control: { kind: 'toggle', group: 'state' },
    },
    {
      name: 'fullWidth',
      attribute: 'full-width',
      reflect: true,
      description: 'Stretches to the width of the container.',
      type: { kind: 'boolean' },
      default: false,
      control: { kind: 'toggle', group: 'layout' },
    },
    {
      name: 'iconStart',
      attribute: 'icon-start',
      reflect: true,
      description: 'Name of the icon before the label.',
      type: { kind: 'icon' },
      default: '',
      control: { kind: 'icon-picker', group: 'content' },
    },
    {
      name: 'iconEnd',
      attribute: 'icon-end',
      reflect: true,
      description: 'Name of the icon after the label.',
      type: { kind: 'icon' },
      default: '',
      control: { kind: 'icon-picker', group: 'content' },
    },
    {
      name: 'iconOnly',
      attribute: 'icon-only',
      reflect: true,
      description: 'Hides the label visually. ariaLabel is required.',
      type: { kind: 'boolean' },
      default: false,
      control: { kind: 'toggle', group: 'content' },
    },
    {
      name: 'ariaLabel',
      attribute: 'aria-label',
      description: 'Accessible name. Required when iconOnly is set; overrides the slot text.',
      type: { kind: 'string' },
      control: { kind: 'text', group: 'accessibility' },
    },
    {
      name: 'loadingLabel',
      attribute: 'loading-label',
      description: 'Optional announcement for the live region while loading.',
      type: { kind: 'string' },
      control: { kind: 'text', group: 'accessibility' },
    },
  ],
  events: [],
  slots: [
    {
      name: '',
      description: 'Visible label. Ignored for the accessible name when ariaLabel is set.',
    },
  ],
  cssParts: [
    { name: 'button', description: 'Inner native button.', stability: 'stable' },
    { name: 'label', description: 'Label and icons.', stability: 'stable' },
    { name: 'spinner', description: 'Loading indicator.', stability: 'stable' },
  ],
  cssProperties: [
    cssProperty('--uds-button-background', 'Fill of the control.', 'button.background'),
    cssProperty('--uds-button-background-hover', 'Fill while hovered.'),
    cssProperty('--uds-button-background-active', 'Fill while pressed.'),
    cssProperty('--uds-button-color', 'Text and icon color.', 'button.color'),
    cssProperty('--uds-button-border-color', 'Border color.'),
    cssProperty('--uds-button-border-width', 'Border width.', 'button.borderWidth'),
    cssProperty('--uds-button-radius', 'Corner radius.', 'button.radius'),
    cssProperty('--uds-button-padding-inline', 'Horizontal padding.', 'button.paddingInline'),
    cssProperty('--uds-button-padding-block', 'Vertical padding.', 'button.paddingBlock'),
    cssProperty('--uds-button-font-size', 'Label size.', 'button.fontSize'),
    cssProperty('--uds-button-font-weight', 'Label weight.', 'button.fontWeight'),
    cssProperty('--uds-button-shadow', 'Box shadow.', 'button.shadow'),
    cssProperty('--uds-button-min-block-size', 'Minimum block size. Never below 24px.'),
    cssProperty('--uds-button-min-inline-size', 'Minimum inline size. Never below 24px.'),
    cssProperty('--uds-button-gap', 'Space between icon and label.', 'button.gap'),
    cssProperty('--uds-button-icon-size', 'Icon box size.'),
  ],
  states: [
    { name: 'hover', description: 'Pointer over the control.' },
    { name: 'active', description: 'Pointer pressed.' },
    { name: 'focus-visible', description: 'Keyboard focus ring from the base styles.' },
    { name: 'disabled', description: 'Not focusable and not activatable.' },
    { name: 'loading', description: 'Focusable, not activatable, aria-busy.' },
  ],
  constraints: [
    {
      kind: 'requires',
      when: { prop: 'iconOnly', equals: true },
      then: { prop: 'ariaLabel', isSet: true },
      message: 'An icon-only button needs ariaLabel.',
    },
  ],
  examples: [
    {
      id: 'primary',
      title: 'Primary',
      config: { component: 'button', slots: { '': [{ text: 'Save' }] } },
    },
    {
      id: 'icon-only',
      title: 'Icon only',
      config: {
        component: 'button',
        props: { iconOnly: true, iconStart: 'close', ariaLabel: 'Close' },
      },
    },
  ],
  accessibility: {
    role: 'button',
    keyboard: [
      { keys: 'Enter', action: 'Activates the control.' },
      { keys: 'Space', action: 'Activates the control.' },
      { keys: 'Tab', action: 'Moves focus. On macOS Safari, Option+Tab.' },
    ],
    requirements: [
      {
        id: 'name',
        wcag: ['4.1.2'],
        description: 'The inner button has a name from the slot or ariaLabel.',
        verification: 'automated',
      },
      {
        id: 'target-size',
        wcag: ['2.5.8'],
        description:
          'The target is at least 24 by 24 CSS pixels, including with custom properties.',
        verification: 'automated',
      },
      {
        id: 'contrast',
        wcag: ['1.4.3', '1.4.11'],
        description: 'Text and border use semantic tokens that pass the theme contrast tests.',
        verification: 'both',
      },
      {
        id: 'keyboard',
        wcag: ['2.1.1'],
        description: 'A native button handles Enter and Space. Disabled is not in the tab order.',
        verification: 'both',
      },
      {
        id: 'status',
        wcag: ['4.1.3'],
        description: 'Loading sets aria-busy and can announce loadingLabel.',
        verification: 'automated',
      },
    ],
    knownLimitations: [
      'Disabled uses the native disabled state and is not focusable. A focusable aria-disabled mode is not provided.',
      'variant="custom" and any override of the color properties are the consumer’s contrast responsibility.',
      'The 24px floor is enforced in CSS and cannot be lowered through custom properties.',
      'aria-labelledby that points outside the shadow tree is not supported. Use the slot or ariaLabel.',
    ],
  },
  responsive: {
    behavior:
      'The label wraps. fullWidth uses the container width. At 320px the control stays inside the viewport.',
    containerQueries: false,
  },
} satisfies ComponentMetadata;
