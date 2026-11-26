/// <reference types="vitest/config" />
// Vitest runs through Astro's Vite config so `?raw` and other Astro-style imports resolve as in the build.
import { getViteConfig } from 'astro/config';

export default getViteConfig({
  test: {
    include: ['src/**/*.test.ts'],
  },
});
