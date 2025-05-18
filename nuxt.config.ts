// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },

  modules: [
    '@nuxt/ui-pro',
    '@nuxt/eslint',
    '@nuxt/content',
    '@nuxt/fonts',
    '@nuxt/icon',
    '@nuxt/image',
    '@nuxt/scripts',
    ['@storyblok/nuxt', {
      accessToken: '8BpRPiEgC07likcWSxJJ9Att',
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

  css: ['~/assets/css/main.css'],

  future: {
    compatibilityVersion: 4
  },

  compatibilityDate: '2024-11-27'
})