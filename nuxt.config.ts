import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'
export default defineNuxtConfig({
  ssr: false,
  devtools: { enabled: true },
  build: {
    transpile: ['vuetify'],
  },
  modules: [
    '@nuxt/content',
    '@nuxt/image',
  ],
  vite: {
    plugins: [
      vuetify({
        styles: { configFile: 'assets/styles/settings.scss' }
      })
    ],
    ssr: {
      noExternal: ['vuetify']
    },
    vue: {
      template: {
        transformAssetUrls,
      },
    },
  },
  vuetify: {
    vuetifyOptions: {
      theme: {
        defaultTheme: 'light',
        themes: {
          light: {
            dark: false,
            colors: {
              primary: '#FFC107',
              secondary: '#FFD54F',
              accent: '#FFA000',
              error: '#FF5252',
              info: '#2196F3',
              success: '#4CAF50',
              warning: '#FFC107',
              background: '#F5F5F5',
              surface: '#FFFFFF'
            }
          },
          dark: {
            dark: true,
            colors: {
              primary: '#FFD54F',
              secondary: '#FFECB3',
              accent: '#FFC107',
              error: '#FF5252',
              info: '#2196F3',
              success: '#4CAF50',
              warning: '#FFC107',
              background: '#121212',
              surface: '#1E1E1E'
            }
          }
        }
      }
    },
    moduleOptions: {
      // Module options
    }
  }
})
