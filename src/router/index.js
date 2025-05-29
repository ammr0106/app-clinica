import { createRouter, createWebHistory } from "vue-router";
import Login from "@/views/Login.vue";
import SuperadminPage from "@/pages/SuperadminPage.vue"
import Coordinador from "@/views/Coordinador.vue";
import Pruebas from "../views/Pruebas.vue";
import Employees from "@/views/Employees.vue";

import { useAuthStore } from "@/stores/useAuthStore";
import { supabase } from "@/services/DatabaseConnection";
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
    meta: { requiresAuth: true, role: "coordinator" },
  },
  {
    path: "/pruebas",
    name: "Pruebas",
    component: Pruebas,
  },
  {
    path: "/employees",
    name: "Employees",
    component: Employees,
    meta: {requiresAuth: true, role:"coordinador"},
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Middleware para verificar autenticación y rol
router.beforeEach(async (to, from, next) => {
  const auth = useAuthStore();

  if (!auth.user) {
    const { data, error } = await supabase.auth.getUser();
    if (data?.user) {
      auth.user = data.user;

      // Traer perfil desde la DB si no está cargado
      if (!auth.profile) {
        const { data: profile } = await supabase
          .from("users")
          .select("*")
          .eq("id", data.user.id)
          .single();

        auth.profile = profile;
      }
    }
  }

  // Si la ruta requiere autenticación
  if (to.meta.requiresAuth) {
    if (!auth.user) {
      console.warn("No autenticado. Redirigiendo a login.");
      return next({ name: "Login" });
    }

    const rol = auth.profile?.rol;
    if (to.meta.role && to.meta.role !== rol) {
      console.warn(`Rol no autorizado. Se requiere: ${to.meta.role}, pero el usuario tiene: ${rol}`);
      return next({ name: "Login" }); // O redirige a una página 403 personalizada
    }
  }

  next();
});

export default router;
