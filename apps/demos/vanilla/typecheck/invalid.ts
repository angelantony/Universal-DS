import { UdsButton } from '@uds/components/button/class';

const element = document.createElement('uds-button');
if (!(element instanceof UdsButton)) throw new Error('expected uds-button');
element.variant = 'nope';
