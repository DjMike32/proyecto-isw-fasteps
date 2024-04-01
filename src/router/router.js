import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";
import SuperAdminHome from "../views/SuperAdminHome.vue";
import About from "../views/About.vue";
import SuperAdminBufetes from "../views/SuperAdminBufetes.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/about",
    name: "About",
    component: About,
  },
  {
    path: "/sa",
    name: "SuperAdminHome",
    component: SuperAdminHome,
  },
  {
    path: "/sa/tramites",
    name: "SuperAdminBufetes",
    component: SuperAdminBufetes,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
