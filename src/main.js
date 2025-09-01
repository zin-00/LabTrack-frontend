import { createApp } from 'vue'
// import './style.css'
import App from './App.vue'
import './assets/main.css'

import Toast from 'vue-toastification'
import 'vue-toastification/dist/index.css'
import router from './router'
import { createPinia } from 'pinia'

import VueApexCharts from 'vue3-apexcharts'
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
import { useApiUrl } from './api/api'

window.Pusher = Pusher;

window.Echo = new Echo({
    broadcaster: 'reverb',
    key: 'zfw9iorec1mrb9z6pzeg', 
    // wsHost: '127.0.0.1', 
    // wsHost: window.location.hostname,
    wsHost: '192.168.1.4',
    wsPort: 8080, 
    wssPort: 8080,
    forceTLS: false, 
    enabledTransports: ['ws', 'wss'],
    disableStats: true,
});




const app = createApp(App)
const pinia = createPinia()
app.use(pinia)

app.use(Toast, {
  position: 'top-right',
  timeout: 3000,
  closeOnClick: true,
  pauseOnHover: true,
})
app.use(router)
app.use(VueApexCharts)

app.mount('#app')
