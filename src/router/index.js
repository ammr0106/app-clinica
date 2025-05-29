import { createRouter, createWebHistory } from "vue-router";
import Login from "@/views/Login.vue";
import SuperadminPage from "@/pages/SuperadminPage.vue";
import { useAuthStore } from "@/stores/useAuthStore";
import { supabase } from "@/services/DatabaseConnection";
import Pruebas from "../views/Pruebas.vue";
import { h } from "vue";
import Headquarters from "@/views/Headquarters.vue";

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
    path: "/headquarters/:headquarters_id",
    name: "Headquarters",
    component: () => import("@/views/Headquarters.vue"),
    meta: { requiresAuth: true, role: ["coordinator", "worker"]},
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
router.beforeEach(async (to, from, next) => {
  const auth = useAuthStore();

  // Verificar si el usuario ya está autenticado
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
    const allowedRoles = Array.isArray(to.meta.role) ? to.meta.role : [to.meta.role];
    if (to.meta.role && !allowedRoles.includes(rol)) {
      console.warn(
        `Rol no autorizado. Se requiere: ${to.meta.role}, pero el usuario tiene: ${rol}`
      );
      return next({ name: "Login" }); 
    }
  }

  //Redirigimos al coordinador a su sede
  if (["coordinator", "worker"].includes(auth.profile?.rol)) {
  const headquartersID = auth.profile?.id_headquarters;

  // Si intenta acceder a cualquier ruta diferente a su headquarters, redirigir
  if (to.name !== "Headquarters" || to.params.headquarters_id !== String(headquartersID)) {
    if (headquartersID) {
      return next({ name: "Headquarters", params: { headquarters_id: headquartersID } });
    } else {
      console.error("No se ha encontrado el id de la sede del usuario");
      return next({ name: "Login" });
    }
  }
}

  next();
});

export default router;
