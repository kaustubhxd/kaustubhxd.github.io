import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import VBodyScrollLock from 'v-body-scroll-lock'
import VueTextareaAutogrowDirective from 'vue-textarea-autogrow-directive'
import SmoothScrollbar from 'vue-smooth-scrollbar'
import tooltip from "./directives/tooltip.js";
import "@/directives/tooltip.css";
import 'viewerjs/dist/viewer.css'
import VueViewer from 'v-viewer'

const app = createApp(App)
// console.log(app.config)
app.config.devtools = true
app.config.performance = true;

app.use(router).use(VBodyScrollLock).use(VueTextareaAutogrowDirective).use(VueViewer).directive('tooltip',tooltip).use(SmoothScrollbar).mount('#app')
document.title = `Kaustubh's Desktop` 
