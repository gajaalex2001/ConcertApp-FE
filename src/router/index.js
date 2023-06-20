// Composables
import { useAppStore } from "@/store/app";
import { createRouter, createWebHistory } from "vue-router";

const LoginPage = () => import("../components/LoginPage.vue");
const SignUpPage = () => import("../components/SignUpPage.vue");
const HomePage = () => import("../components/HomePage.vue");
const ConcertsPage = () => import("../components/ConcertsPage.vue");
const AddConcertPage = () => import("../components/AddConcertPage.vue");
const ViewConcertPage = () => import("../components/ViewConcertPage.vue");
const NotFoundPage = () => import("../components/NotFoundPage.vue");

const routes = [
  { path: "/", redirect: "/concerts" },
  { path: "/login", component: LoginPage, meta: { requiresUnauth: true } },
  { path: "/register", component: SignUpPage, meta: { requiresUnauth: true } },
  {
    path: "/concerts",
    component: HomePage,
    meta: { requiresAuth: true },
    children: [
      {
        path:"", component: ConcertsPage
      },
      {
        path:"add-concert", component: AddConcertPage
      },
      {
        path:":id", component: ViewConcertPage
      }
    ],
  },
  { path: "/:pathMatch(.*)*", component: NotFoundPage },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach((to, _, next) => {
  const store = useAppStore();

  if (to.meta.requiresAuth && !store.isAuthenticated) {
    next("/login");
  } else if (to.meta.requiresUnauth && store.isAuthenticated) {
    next("/concerts");
  } else {
    next();
  }
});

export default router;
