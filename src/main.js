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

window.Pusher = Pusher;

window.echo = new Echo({
    broadcaster: 'reverb',
    key: 'zfw9iorec1mrb9z6pzeg', 
    wsHost: '127.0.0.1', 
    wsPort: 8080, 
    wssPort: 8080,
    forceTLS: false, 
    enabledTransports: ['ws', 'wss'],
    disableStats: true,

    auth: {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`, // If using auth
        },
    },
    authEndpoint: 'http://localhost:8000/broadcasting/auth', // Your Laravel API URL
});




const app = createApp(App)
const pinia = createPinia()

app.use(Toast, {
  position: 'top-right',
  timeout: 3000,
  closeOnClick: true,
  pauseOnHover: true,
})
app.use(pinia)
app.use(router)
app.use(VueApexCharts)

app.mount('#app')
