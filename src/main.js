import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import VBodyScrollLock from 'v-body-scroll-lock'
import VueTextareaAutogrowDirective from 'vue-textarea-autogrow-directive'
import SmoothScrollbar from 'vue-smooth-scrollbar'
import tooltip from "./directives/tooltip.js";
import "@/directives/tooltip.css";

createApp(App).use(router).use(VBodyScrollLock).use(VueTextareaAutogrowDirective).directive('tooltip',tooltip).use(SmoothScrollbar).mount('#app')
document.title = `Kaustubh's Desktop` 
