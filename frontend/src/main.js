import 'github-markdown-css/github-markdown.css'

import { createApp } from 'vue'
import router from './router'
import App from './App.vue'

createApp(App).use(router).mount('#app')
