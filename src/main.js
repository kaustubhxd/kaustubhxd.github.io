import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import VBodyScrollLock from 'v-body-scroll-lock'


createApp(App).use(router).use(VBodyScrollLock).mount('#app')
