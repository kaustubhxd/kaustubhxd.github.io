import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import VBodyScrollLock from 'v-body-scroll-lock'
import VueTextareaAutogrowDirective from 'vue-textarea-autogrow-directive'

createApp(App).use(router).use(VBodyScrollLock).use(VueTextareaAutogrowDirective).mount('#app')
