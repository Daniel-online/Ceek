import { defineConfig } from 'vite';
import { htmx } from 'htmx';

export default defineConfig({
  plugins: [
    htmx(),
  ],
});