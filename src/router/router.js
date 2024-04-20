import { createRouter, createWebHistory } from "vue-router";

import SuperAdminHome from "../views/SuperAdminHome.vue";
import SuperAdminTramites from "../views/SuperAdminTramites.vue";
import SuperAdminBufetes from "../views/SuperAdminBufetes.vue";
import SuperAdminMain from "../views/SuperAdminMain.vue";
import LoginSa from "../views/LoginSa.vue";
import SuperAdminActualizar from "../views/SuperAdminActualizar.vue";
import SuperAdminBufetesAgregar from "../views/SuperAdminBufetesAgregar.vue";
import DashboardTemplate from "../components/DashboardTemplate.vue";

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
  {
    path: "/sa/actualizar",
    name: "SuperAdminActualizar",
    component: SuperAdminActualizar,
  },
  {
    path: "/sa/bufetes/agregar",
    name: "SuperAdminBufetesAgregar",
    component: SuperAdminBufetesAgregar,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
