import { createApp } from 'vue'
import { createPinia } from 'pinia'
import Vue3Toastify from 'vue3-toastify'
import router from './router'
import App from './App.vue'

// Styles
import './assets/main.css'
import 'vue3-toastify/dist/index.css'

// Create app
const app = createApp(App)

// Use plugins
app.use(createPinia())
app.use(router)
app.use(Vue3Toastify, {
  autoClose: 3000,
  style: {
    opacity: '1',
    userSelect: 'initial',
  },
})

// Mount app
app.mount('#app')
