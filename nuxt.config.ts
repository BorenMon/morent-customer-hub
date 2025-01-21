import { fileURLToPath } from 'url';

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  css: ['~/assets/css/main.css'],
  modules: [
    '@pinia/nuxt',
    'pinia-plugin-persistedstate/nuxt',
    'nuxt-splide'
  ],
  alias: {
    'data': fileURLToPath(new URL('./assets/data', import.meta.url))
  },
  // devtools: {
  //   enabled: true
  // }
})
