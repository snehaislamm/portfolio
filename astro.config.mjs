// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

// Static output only: no adapter, no server (AD-10, Epic 1).
export default defineConfig({
  output: 'static',
  integrations: [react()],
  vite: {
    build: {
      // Never inline assets: every bundled asset (scripts, images, fonts, small CSS)
      // is emitted as a separate /_astro/* file. This keeps the <Analytics /> script
      // out of the built HTML (it is still loaded, as one external file).
      assetsInlineLimit: 0,
    },
  },
});
