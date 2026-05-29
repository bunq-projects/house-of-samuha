// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://bunq-projects.github.io',
  base: '/house-of-samuha/',
  output: 'static',
  vite: {
    plugins: [tailwindcss()],
  },
});
