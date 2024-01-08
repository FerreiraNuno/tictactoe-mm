import './assets/main.css'

// main.ts
import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import LandingPage from "./components/LandingPage.vue";
import LoginModal from "./components/LoginModal.vue";
import GameView from "./components/GameView.vue";

const router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: '/', component: LandingPage },
        { path: '/login', component: LoginModal },
        { path: '/play', component: GameView },
        { path: '/:pathMatch(.*)*', redirect: '/' }, // catch-all route
    ],
})

createApp(App).use(router).mount('#app')

