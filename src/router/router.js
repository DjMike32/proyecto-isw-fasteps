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
import SuperAdminBufetesBuscar from "../views/SuperAdminBufetesBuscar.vue";
import SuperAdminBufetesBorrar from "../views/SuperAdminBufetesBorrar.vue";
import SuperAdminBufetesActualizar from "../views/SuperAdminBufetesActualizar.vue";
import SuperAdminTramitesPagoAgregar from "../views/SuperAdminTramitesPagoAgregar.vue";
import SuperAdminTramitesPagoEliminar from "../views/SuperAdminTramitesPagoEliminar.vue";
import SuperAdminTramitesPagoBuscar from "../views/SuperAdminTramitesPagoBuscar.vue";
import SuperAdminTramitesPagoActualizar from "../views/SuperAdminTramitesPagoActualizar.vue";
import SuperAdminTramitesGratisAgregar from "../views/SuperAdminTramitesGratisAgregar.vue";
import SuperAdminTramitesGratisEliminar from "../views/SuperAdminTramitesGratisEliminar.vue";
import SuperAdminTramitesGratisBuscar from "../views/SuperAdminTramitesGratisBuscar.vue";
import SuperAdminTramitesGratisActualizar from "../views/SuperAdminTramitesGratisActualizar.vue";

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
  {
    path: "/sa/bufetes/buscar",
    name: "SuperAdminBufetesBuscar",
    component: SuperAdminBufetesBuscar,
  },
  {
    path: "/sa/bufetes/borrar",
    name: "SuperAdminBufetesBorrar",
    component: SuperAdminBufetesBorrar,
  },
  {
    path: "/sa/bufetes/actualizar",
    name: "SuperAdminBufetesActualizar",
    component: SuperAdminBufetesActualizar,
  },
  {
    path: "/sa/tramites/pago/agregar",
    name: "SuperAdminTramitesPagoAgregar",
    component: SuperAdminTramitesPagoAgregar,
  },
  {
    path: "/sa/tramites/pago/eliminar",
    name: "SuperAdminTramitesPagoEliminar",
    component: SuperAdminTramitesPagoEliminar,
  },
  {
    path: "/sa/tramites/pago/buscar",
    name: "SuperAdminTramitesPagoBuscar",
    component: SuperAdminTramitesPagoBuscar,
  },
  {
    path: "/sa/tramites/pago/actualizar",
    name: "SuperAdminTramitesPagoActualizar",
    component: SuperAdminTramitesGratisActualizar,
  },
  {
    path: "/sa/tramites/gratis/agregar",
    name: "SuperAdminTramitesGratisAgregar",
    component: SuperAdminTramitesGratisAgregar,
  },
  {
    path: "/sa/tramites/gratis/eliminar",
    name: "SuperAdminTramitesGratisEliminar",
    component: SuperAdminTramitesGratisEliminar,
  },
  {
    path: "/sa/tramites/gratis/buscar",
    name: "SuperAdminTramitesGratisBuscar",
    component: SuperAdminTramitesGratisBuscar,
  },
  {
    path: "/sa/tramites/gratis/actualizar",
    name: "SuperAdminTramitesGratisActualizar",
    component: SuperAdminTramitesGratisActualizar,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
