import './style.css'
import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'

// arco-design
import ArcoVue from '@arco-design/web-vue'
import '@arco-design/web-vue/dist/arco.css'

const app = createApp(App)
app.use(ArcoVue)
app.mount('#app')
