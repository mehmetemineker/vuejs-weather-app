import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import PrimeVue from 'primevue/config';
import { createPinia } from 'pinia'
import Button from 'primevue/button';
import Card from 'primevue/card';
import InputText from "primevue/inputtext";

import 'primevue/resources/themes/lara-light-teal/theme.css';
import 'primevue/resources/primevue.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';

const pinia = createPinia()

const app = createApp(App);

app.use(PrimeVue);
app.use(pinia)

app.component('Button', Button);
app.component('Card', Card);
app.component('InputText', InputText)

app.mount('#app')