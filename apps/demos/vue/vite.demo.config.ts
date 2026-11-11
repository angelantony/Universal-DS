import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';
import { udsVueTemplateOptions } from '@uds/vue';

export default defineConfig({
  plugins: [vue({ template: udsVueTemplateOptions() })],
  server: { host: '127.0.0.1', port: 4184, strictPort: true },
});
