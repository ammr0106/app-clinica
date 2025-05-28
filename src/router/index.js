import { createRouter, createWebHistory } from "vue-router";
import Login from "@/views/Login.vue";
import SuperadminPage from "@/pages/SuperadminPage.vue"
import Coordinador from "@/views/Coordinador.vue";
import Pruebas from "../views/Pruebas.vue";

const routes = [
  {
    path: "/",
    name: "Login",
    component: Login,
  },
  {
    path: "/superadmin",
    name: "SuperAdmin",
    component: SuperadminPage,
    meta: { requiresAuth: true, role: "superadmin" },
  },
  {
    path: "/coordinador",
    name: "Coordinador",
    component: Coordinador,
    meta: { requiresAuth: true, role: "coordinador" },
  },
  {
    path: "/pruebas",
    name: "Pruebas",
    component: Pruebas,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Middleware para verificar autenticación y rol
router.beforeEach((to, from, next) => {
  const user = JSON.parse(localStorage.getItem("user"));

  if (to.meta.requiresAuth) {
    if (!user) {
      return next({ name: "Login" });
    }

    if (to.meta.role && to.meta.role !== user.role) {
      return next({ name: "Login" }); // o redireccionar a un 403 , esto habria que ajustarlo mas adelante e incluso personalizarlo
    }
  }

  next();
});

export default router;
