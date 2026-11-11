import '@uds/themes/css';
import '@uds/tokens/css';
import '../dist/button/define.js';

const stage = document.querySelector('#stage');
if (stage) {
  const button = document.createElement('uds-button');
  button.textContent = 'Salva';
  button.toggleAttribute('full-width', true);
  stage.append(button);
}
