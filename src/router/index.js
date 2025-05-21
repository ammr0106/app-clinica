//Enrutador
import { createRouter, createWebHistory } from 'vue-router'
import Login from '@/views/Login.vue'
import SuperAdmin from '../views/SuperAdmin.vue'

//Rutas
const routes = [
  {
    path: '/',
    name: 'Login',
    component: Login,
  },
    {
    path: '/superadmin',
    name: 'SuperAdmin',
    component: SuperAdmin,
    meta: { requiresAuth: true, role: 'superadmin' }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})


// Middleware para verificar autenticación y rol
router.beforeEach((to, from, next) => {
  const user = JSON.parse(localStorage.getItem('user')) // Supongamos que guardas el usuario así

  if (to.meta.requiresAuth) {
    if (!user) {
      return next({ name: 'Login' })
    }

    if (to.meta.role && to.meta.role !== user.role) {
      return next({ name: 'Login' }) // O redirigir a una vista diferente según el rol
    }
  }

  next()
})

export default router
