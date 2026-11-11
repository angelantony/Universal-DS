import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';

export default defineConfig({
  root: fileURLToPath(new URL('.', import.meta.url)),
  server: {
    port: 4178,
    strictPort: true,
    host: '127.0.0.1',
    allowedHosts: ['host.docker.internal'],
  },
});
