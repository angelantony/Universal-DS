declare module '@uds/tokens/css';
declare module '@uds/themes/css';

declare module '*.vue' {
  import type { DefineComponent } from 'vue';
  const component: DefineComponent;
  export default component;
}
