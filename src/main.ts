import { createApp } from 'vue'

import App from './App.vue'
import { i18n } from './i18n'
import { registerFeatures } from './features/registerFeatures'
import { vueQueryPlugin } from './query'
import router from './router'
import { pinia } from './stores'

import './style.css'

const app = createApp(App)

app.use(pinia)
app.use(i18n)

registerFeatures()

app.use(vueQueryPlugin)
app.use(router)

app.mount('#app')
