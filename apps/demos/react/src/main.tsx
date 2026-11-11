import { createRoot } from 'react-dom/client';
import '@uds/themes/css';
import '@uds/tokens/css';
import { App } from './App.js';

const root = document.querySelector('#root');
if (root === null) throw new Error('missing root');
createRoot(root).render(<App />);
