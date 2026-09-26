// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: [
    '@nuxt/eslint',
    '@nuxt/image',
    '@pinia/nuxt',
    '@nuxtjs/tailwindcss'
  ],
  alias: {
    '@contracts': '~/types',
  },
  runtimeConfig: {
    public: {
      apiBase: 'https://cms.test.ksfr.tech/api/v1/',
      apiSnapshot: false,
      apiTimeout: 3000
    }
  },
  image: {
    // картинки уже ресайзит CDN стенда (шаблон {w}x{h} в resize_url)
    provider: 'none'
  }
})