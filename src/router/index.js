// Composables
import { useAppStore } from "@/store/app";
import { createRouter, createWebHistory } from "vue-router";

const LoginPage = () => import("../components/LoginPage.vue");
const SignUpPage = () => import("../components/SignUpPage.vue");
const HomePage = () => import("../components/HomePage.vue");
const NotFoundPage = () => import("../components/NotFoundPage.vue");

const routes = [
  { path: "/", redirect: "/home" },
  { path: "/login", component: LoginPage, meta: { requiresUnauth: true } },
  { path: "/register", component: SignUpPage, meta: { requiresUnauth: true } },
  { path: "/home", component: HomePage, meta: { requiresAuth: true }  },
  { path: "/:pathMatch(.*)*", component: NotFoundPage },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach((to, _, next) => {
  const store = useAppStore();
  
  if(to.meta.requiresAuth && !store.isAuthenticated) {
    next('/login');
  } else if (to.meta.requiresUnauth && store.isAuthenticated) {
    next('/home')
  } else {
    next();
  }
});

export default router;
