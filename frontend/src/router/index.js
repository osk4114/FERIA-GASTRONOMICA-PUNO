import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

// Lazy loading de componentes
const Login = () => import('@/views/Login.vue')
const Dashboard = () => import('@/views/Dashboard.vue')
const Products = () => import('@/views/Products.vue')
const Reports = () => import('@/views/Reports.vue')
const Surveys = () => import('@/views/Surveys.vue')
const Users = () => import('@/views/Users.vue')
const Profile = () => import('@/views/Profile.vue')
const NotFound = () => import('@/views/NotFound.vue')

const routes = [
  {
    path: '/',
    redirect: '/dashboard'
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { 
      requiresAuth: false,
      title: 'Iniciar Sesión'
    }
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    meta: { 
      requiresAuth: true,
      title: 'Dashboard',
      roles: ['administrador', 'organizador', 'visitante', 'productor']
    }
  },
  {
    path: '/products',
    name: 'Products',
    component: Products,
    meta: { 
      requiresAuth: true,
      title: 'Productos',
      roles: ['administrador', 'organizador', 'productor']
    }
  },
  {
    path: '/reports',
    name: 'Reports',
    component: Reports,
    meta: { 
      requiresAuth: true,
      title: 'Reportes',
      roles: ['administrador', 'organizador']
    }
  },
  {
    path: '/surveys',
    name: 'Surveys',
    component: Surveys,
    meta: { 
      requiresAuth: true,
      title: 'Encuestas',
      roles: ['administrador', 'organizador', 'visitante']
    }
  },
  {
    path: '/users',
    name: 'Users',
    component: Users,
    meta: { 
      requiresAuth: true,
      title: 'Usuarios',
      roles: ['administrador']
    }
  },
  {
    path: '/admin/users',
    name: 'UserManagement',
    component: () => import('@/views/admin/UserManagement.vue'),
    meta: { 
      requiresAuth: true,
      title: 'Gestión de Usuarios',
      roles: ['administrador']
    }
  },
  {
    path: '/admin/sessions',
    name: 'SessionManagement',
    component: () => import('@/views/admin/SessionManagement.vue'),
    meta: { 
      requiresAuth: true,
      title: 'Gestión de Sesiones',
      roles: ['administrador']
    }
  },
  {
    path: '/profile',
    name: 'Profile',
    component: Profile,
    meta: { 
      requiresAuth: true,
      title: 'Mi Perfil',
      roles: ['administrador', 'organizador', 'visitante', 'productor']
    }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFound,
    meta: { 
      title: 'Página no encontrada'
    }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

// Navigation guards
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()
  
  // Actualizar título de la página
  document.title = to.meta.title ? `${to.meta.title} - Feria Gastronómica Puno` : 'Feria Gastronómica Puno'
  
  // Verificar autenticación
  if (to.meta.requiresAuth) {
    // Solo verificar sesión si tenemos token y no estamos ya inactivos
    if (!authStore.token || authStore.sessionStatus === 'inactive') {
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      })
      return
    }
    
    // Verificar sesión solo si el estado es 'checking' o no está definido
    if (authStore.sessionStatus === 'checking' || authStore.sessionStatus === 'active') {
      const isAuthenticated = await authStore.checkSession()
      
      if (!isAuthenticated) {
        next({
          path: '/login',
          query: { redirect: to.fullPath }
        })
        return
      }
    }
    
    // Verificar roles
    if (to.meta.roles && !to.meta.roles.includes(authStore.userRole)) {
      next({
        path: '/dashboard',
        query: { error: 'access_denied' }
      })
      return
    }
  }
  
  // Si está autenticado y trata de ir al login, redirigir al dashboard
  if (to.name === 'Login' && authStore.isAuthenticated) {
    next('/dashboard')
    return
  }
  
  next()
})

export default router
