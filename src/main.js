import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import VBodyScrollLock from 'v-body-scroll-lock'
import VueTextareaAutogrowDirective from 'vue-textarea-autogrow-directive'
import SmoothScrollbar from 'vue-smooth-scrollbar'

createApp(App).use(router).use(VBodyScrollLock).use(VueTextareaAutogrowDirective).use(SmoothScrollbar).mount('#app')
