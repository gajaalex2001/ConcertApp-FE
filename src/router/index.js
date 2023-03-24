// Composables
import { createRouter, createWebHistory } from "vue-router";

const LoginPage = () => import("../components/LoginPage.vue");
const SignUpPage = () => import("../components/SignUpPage.vue");
const NotFoundPage = () => import("../components/NotFoundPage.vue");

const routes = [
  { path: "/", redirect: "/login" },
  { path: "/login", component: LoginPage },
  { path: "/register", component: SignUpPage },
  { path: "/:pathMatch(.*)*", component: NotFoundPage },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
