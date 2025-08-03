import { createApp } from 'vue'
// import PrimeVue from 'primevue/config'
import router from './router'
import store from './store'
import App from './App.vue'

// Import global styles
import './styles/main.css'
// import 'primeflex/primeflex.css'

const app = createApp(App)

app.use(store)
app.use(router)
// app.use(PrimeVue)

app.mount('#app')
