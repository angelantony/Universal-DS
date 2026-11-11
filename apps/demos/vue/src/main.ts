import { createApp } from 'vue';
import '@uds/themes/css';
import '@uds/tokens/css';
import { udsVuePlugin } from '@uds/vue';
import App from './App.vue';

const root = document.querySelector('#root');
if (root === null) throw new Error('missing root');
createApp(App).use(udsVuePlugin).mount(root);
