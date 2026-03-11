import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import vercel from '@astrojs/vercel';

export default defineConfig({
  integrations: [tailwind()],
  site: 'https://onecyberlogix.com',
  output: 'server',
  adapter: vercel({
    webAnalytics: {
      enabled: true
    },
    imageService: 'vercel'
  }),
  server: {
    headers: {
      'Access-Control-Allow-Origin': '*',
    }
  },
  security: {
    checkOrigin: false
  }
});
