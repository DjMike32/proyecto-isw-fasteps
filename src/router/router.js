import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";
import SuperAdminHome from "../views/SuperAdminHome.vue";
import About from "../views/About.vue";
import SuperAdminBufetes from "../views/SuperAdminBufetes.vue";
import SuperAdminMain from "../views/SuperAdminMain.vue";

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
  {
    path: "/sa/main",
    name: "SuperAdminMain",
    component: SuperAdminMain,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
