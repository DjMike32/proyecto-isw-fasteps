import { createRouter, createWebHistory } from "vue-router";

import SuperAdminHome from "../views/SuperAdminHome.vue";
import SuperAdminTramites from "../views/SuperAdminTramites.vue";
import SuperAdminBufetes from "../views/SuperAdminBufetes.vue";
import SuperAdminMain from "../views/SuperAdminMain.vue";
import LoginSa from "../views/LoginSa.vue";

const routes = [
  {
    path: "/sa",
    name: "SuperAdminHome",
    component: SuperAdminHome,
  },
  {
    path: "/sa/tramites",
    name: "SuperAdminTramites",
    component: SuperAdminTramites,
  },
  {
    path: "/sa/main",
    name: "SuperAdminMain",
    component: SuperAdminMain,
  },
  {
    path: "/",
    name: "LoginSa",
    component: LoginSa,
  },
  {
    path: "/sa/bufetes",
    name: "SupperAdminBufetes",
    component: SuperAdminBufetes,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
