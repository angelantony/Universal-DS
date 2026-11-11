import { defineElement } from '@uds/core';
import { registerBuiltInIcons } from './built-in.js';
import { UdsIcon } from './icon.js';

registerBuiltInIcons();
defineElement('uds-icon', UdsIcon);
