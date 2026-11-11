import type { StorybookConfig } from '@storybook/web-components-vite';

const config: StorybookConfig = {
  stories: ['../stories/**/*.stories.ts'],
  framework: '@storybook/web-components-vite',
  docs: { autodocs: false },
  core: {
    disableWhatsNewNotifications: true,
  },
  features: {
    sidebarOnboardingChecklist: false,
    menuOnboardingChecklist: false,
    controls: false,
    actions: false,
    interactions: false,
    changeDetection: false,
  },
};

export default config;
