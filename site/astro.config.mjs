// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  // 部署後若網址不同，記得同步改 src/site.config.ts 的 url
  site: "https://isocyclo.com",
  integrations: [sitemap()],
});
