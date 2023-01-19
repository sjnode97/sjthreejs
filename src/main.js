import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import pcg from '../package.json'

console.log(pcg)
createApp(App).use(router).mount('#app')
