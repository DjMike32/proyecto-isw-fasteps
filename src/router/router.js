import { createRouter, createWebHistory } from "vue-router";

import SuperAdminHome from "../views/SuperAdminHome.vue";
import SuperAdminTramites from "../views/SuperAdminTramites.vue";
import SuperAdminBufetes from "../views/SuperAdminBufetes.vue";
import SuperAdminMain from "../views/SuperAdminMain.vue";
import LoginSa from "../views/LoginSa.vue";
import SuperAdminActualizar from "../views/SuperAdminPerfilActualizar.vue";
import SuperAdminBufetesAgregar from "../views/SuperAdminBufetesAgregar.vue";
import DashboardTemplate from "../components/DashboardTemplate.vue";
import SuperAdminTramitesPago from "../views/SuperAdminTramitesPago.vue";
import SuperAdminTramitesGratis from "../views/SuperAdminTramitesGratis.vue";
import SuperAdminTramitesGratisVer from "../views/SuperAdminTramitesGratisVer.vue";
import SuperAdminVerPerfil from "../views/SuperAdminVerPerfil.vue";

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
    path: "/sa/perfil/actualizar",
    name: "SuperAdminActualizar",
    component: SuperAdminActualizar,
  },
  {
    path: "/sa/bufetes/agregar",
    name: "SuperAdminBufetesAgregar",
    component: SuperAdminBufetesAgregar,
  },
  {
    path: "/sa/tramites/pago",
    name: "SuperAdminTramitesPago",
    component: SuperAdminTramitesPago,
  },
  {
    path: "/sa/tramites/gratis",
    name: "SuperAdminTramitesGratis",
    component: SuperAdminTramitesGratis,
  },
  {
    path: "/sa/perfil/ver",
    name: "SuperAdminVerPerfil",
    component: SuperAdminVerPerfil,
  },
  {
    path: "/sa/tramites/gratis/ver",
    name: "SuperAdminTramitesGratisVer",
    component: SuperAdminTramitesGratisVer,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
