// import this after install `@mdi/font` package
import '@mdi/font/css/materialdesignicons.css'
import 'leaflet/dist/leaflet.css';
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import { md3 } from 'vuetify/blueprints'
import { aliases, mdi } from 'vuetify/iconsets/mdi'

export default defineNuxtPlugin((app) => {
    const vuetify = createVuetify({
        blueprint: md3,
        theme: {
            defaultTheme: 'myLightTheme',
            themes: {
                myLightTheme: {
                    dark: false,
                    colors: {
                        primary: '#325eaf',
                        secondary: '#FFC107',
                        accent: '#9C27B0',
                        background: '#FFFFFF',
                        surface: '#F5F5F5',
                    },
                },
            },
        },
        icons: {
            defaultSet: 'mdi',
            aliases,
            sets: {
                mdi,
            },
        },
    })

    app.vueApp.use(vuetify)
})
