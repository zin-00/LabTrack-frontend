import { createApp } from 'vue'
// import './style.css'
import App from './App.vue'
import './assets/main.css'

import Toast from 'vue-toastification'
import 'vue-toastification/dist/index.css'
import router from './router'
import { createPinia } from 'pinia'
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

window.Pusher = Pusher;

window.Echo = new Echo({
    broadcaster: 'reverb',
    key: 'zfw9iorec1mrb9z6pzeg',
    wsHost: '127.0.0.1',
    wsPort: 8080,
    forceTLS: false,
    enabledTransports: ['ws'],
    disableStats: true,
    authorizer: (channel, options) => {
      return {
        authorize: (socketId, callback) => {
          axios.post('/broadcasting/auth', {
            socket_id: socketId,
            channel_name: channel.name
          }).then(response => {
            callback(false, response.data);
          }).catch(error => {
            callback(true, error);
          });
        }
      }
    }
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

app.mount('#app')
