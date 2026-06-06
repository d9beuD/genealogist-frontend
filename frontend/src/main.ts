import { createApp } from 'vue'

import App from './App.vue'
import { i18n } from './i18n'
import { registerFeatureMessages } from './i18n/features'
import { treeMessages } from './features/tree/i18n/treeMessages'
import { loginMessages } from './features/login/i18n/loginMessages'
import { registrationMessages } from './features/registration/i18n/registrationMessages'
import { vueQueryPlugin } from './query'
import router from './router'
import { pinia } from './stores'

import './style.css'

const app = createApp(App)

app.use(pinia)
app.use(i18n)

registerFeatureMessages('tree', treeMessages)
registerFeatureMessages('login', loginMessages)
registerFeatureMessages('registration', registrationMessages)

app.use(vueQueryPlugin)
app.use(router)

app.mount('#app')
