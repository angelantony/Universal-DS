import type { Preview } from '@storybook/web-components-vite';
import '@uds/tokens/css';
import '@uds/themes/css';
import { appLocale } from '../stories/copy.js';

const preview: Preview = {
  parameters: {
    layout: 'centered',
  },
  initialGlobals: {
    locale: 'it',
  },
  globalTypes: {
    locale: {
      description: 'Lingua dell’interfaccia',
      toolbar: {
        title: 'Lingua',
        icon: 'globe',
        items: [
          { value: 'it', title: 'Italiano', right: 'IT' },
          { value: 'en', title: 'English', right: 'EN' },
        ],
        dynamicTitle: true,
      },
    },
  },
  decorators: [
    (story, context) => {
      document.documentElement.lang = appLocale(context.globals['locale']);
      return story();
    },
  ],
};

export default preview;
