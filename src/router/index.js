
import { createRouter, createWebHistory } from 'vue-router'
import Login from '@/views/Login.vue'
import SuperAdmin from '@/views/SuperAdmin.vue'
import Coordinador from '@/views/Coordinador.vue'

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
    meta: { requiresAuth: true, role: 'superadmin' },
  },
  {
    path: '/coordinador',
    name: 'Coordinador',
    component: Coordinador,
    meta: { requiresAuth: true, role: 'coordinador' },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// Middleware para verificar autenticación y rol
router.beforeEach((to, from, next) => {
  const user = JSON.parse(localStorage.getItem('user'))

  if (to.meta.requiresAuth) {
    if (!user) {
      return next({ name: 'Login' })
    }

    if (to.meta.role && to.meta.role !== user.role) {
      return next({ name: 'Login' }) // o redireccionar a un 403 , esto habria que ajustarlo mas adelante e incluso personalizarlo
    }
  }

  next()
})

export default router
