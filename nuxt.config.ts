// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },

  css: [
    '@/assets/css/main.css',
  ],
   ui: {
    colorMode: false
  },

  modules: [
    '@nuxt/ui-pro',
    '@nuxt/eslint',
    '@nuxt/content',
    '@nuxt/fonts',
    '@nuxt/icon',
    '@nuxt/image',
    '@nuxt/scripts',
 
    ['@storyblok/nuxt', {
      accessToken: process.env.STORYBLOK_ACCESS_TOKEN,
      componentsDir: '~/storyblok',
    }],
  ],
   components: {
    dirs: [
      {
        path: "~/storyblok",
        global: true,
      },
      {
        path: "~/components",
        global: true,
      },
    ],
  },

  future: {
    compatibilityVersion: 4
  },
   runtimeConfig: {
    public: {
      storyblokAccessToken: process.env.STORYBLOK_ACCESS_TOKEN,
      storyblokContentVersion: process.env.STORYBLOK_CONTENT_VERSION || 'draft',
    },
  },
ui: {
    colorMode: false
  },
  compatibilityDate: '2024-11-27'
})