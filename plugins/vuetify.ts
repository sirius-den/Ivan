// import this after install `@mdi/font` package
import '@mdi/font/css/materialdesignicons.css'

// Import Vuetify styles and our custom settings
import 'vuetify/styles'
import '@/assets/styles/settings.scss'
import { createVuetify } from 'vuetify'

export default defineNuxtPlugin((app) => {
  const vuetify = createVuetify({
    // ... your configuration
  })
  app.vueApp.use(vuetify)
})
