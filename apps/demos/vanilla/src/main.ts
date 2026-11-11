import '@uds/themes/css';
import '@uds/tokens/css';

import '@uds/components/button';

const button = document.querySelector('#label-button');
const count = document.querySelector('#count');
const form = document.querySelector('#demo-form');
const submitted = document.querySelector('#submitted');
const disabled = document.querySelector('#disabled');
const disabledCount = document.querySelector('#disabled-count');

if (
  button === null ||
  !(count instanceof HTMLElement) ||
  !(form instanceof HTMLFormElement) ||
  !(submitted instanceof HTMLElement) ||
  disabled === null ||
  !(disabledCount instanceof HTMLElement)
) {
  throw new Error('missing demo nodes');
}

let clicks = 0;
button.addEventListener('click', () => {
  clicks += 1;
  count.textContent = String(clicks);
});

form.addEventListener('submit', (event) => {
  event.preventDefault();
  submitted.textContent = 'yes';
});

let disabledClicks = 0;
disabled.addEventListener('click', () => {
  disabledClicks += 1;
  disabledCount.textContent = String(disabledClicks);
});
