<template>
  <AppLayout>
    <div class="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <!-- Header Mejorado -->
        <div class="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-4">
              <div class="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <span class="text-2xl font-bold text-white">{{ authStore.user?.nombre?.charAt(0) }}</span>
              </div>
              <div>
                <h1 class="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                  ¡Bienvenido, {{ authStore.user?.nombre }}!
                </h1>
                <p class="text-gray-600 flex items-center space-x-2">
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize">
                    {{ authStore.user?.rol }}
                  </span>
                  <span class="text-gray-400">•</span>
                  <span>{{ formatDateTime(new Date()) }}</span>
                </p>
              </div>
            </div>
            <div class="text-right">
              <div class="flex items-center space-x-2">
                <div class="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                <span class="text-sm font-medium text-green-600">Conectado</span>
              </div>
              <p class="text-xs text-gray-400 mt-1">Última actividad: ahora</p>
            </div>
          </div>
        </div>

        <!-- Debug Info - Solo en desarrollo -->
        <div v-if="isDevelopment" class="bg-gradient-to-r from-yellow-50 to-orange-50 border-l-4 border-yellow-400 rounded-lg p-4 shadow-sm">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <svg class="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
              </svg>
            </div>
            <div class="ml-3">
              <h3 class="text-sm font-medium text-yellow-800">Modo Desarrollo Activo</h3>
              <div class="mt-2 text-sm text-yellow-700 space-y-1">
                <p><span class="font-medium">Usuario:</span> {{ authStore.user?.nombre }}</p>
                <p><span class="font-medium">Email:</span> {{ authStore.user?.email }}</p>
                <p><span class="font-medium">Rol:</span> {{ authStore.userRole }}</p>
                <p><span class="font-medium">Autenticado:</span> 
                  <span :class="authStore.isAuthenticated ? 'text-green-600' : 'text-red-600'">
                    {{ authStore.isAuthenticated ? '✓ Sí' : '✗ No' }}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Admin Dashboard -->
        <div v-if="authStore.userRole === 'administrador'" class="space-y-8">
          <!-- Estadísticas Principales -->
          <div>
            <h2 class="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <div class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                <svg class="h-5 w-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              Métricas del Sistema
            </h2>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                title="Total Usuarios"
                :value="adminStore.dashboardStats?.totalUsers || 0"
                icon="UsersIcon"
                color="blue"
                :loading="statsLoading"
                :trend="usersTrend"
                description="Usuarios registrados"
              />
              <StatCard
                title="Sesiones Activas"
                :value="adminStore.dashboardStats?.activeSessions || 0"
                icon="ShieldCheckIcon"
                color="green"
                :loading="statsLoading"
                description="Conectados ahora"
              />
              <StatCard
                title="Total Productos"
                :value="adminStore.dashboardStats?.totalProducts || 0"
                icon="CubeIcon"
                color="purple"
                :loading="statsLoading"
                :trend="productsTrend"
                description="En catálogo"
              />
              <StatCard
                title="Encuestas Completadas"
                :value="adminStore.dashboardStats?.totalSurveys || 0"
                icon="ClipboardDocumentListIcon"
                color="yellow"
                :loading="statsLoading"
                description="Feedback recibido"
              />
            </div>
          </div>
        </div>

        <!-- Organizador Dashboard -->
        <div v-if="authStore.userRole === 'organizador'" class="space-y-8">
          <div>
            <h2 class="text-xl font-semibold text-gray-900 mb-6">Panel del Organizador</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                title="Mis Productos"
                :value="organizadorStats.totalProducts"
                icon="CubeIcon"
                color="blue"
                description="Productos registrados"
              />
              <StatCard
                title="Encuestas Recibidas"
                :value="organizadorStats.totalSurveys"
                icon="ClipboardDocumentListIcon"
                color="green"
                description="Feedback recibido"
              />
              <StatCard
                title="Puntuación Promedio"
                :value="organizadorStats.avgRating || 0"
                icon="StarIcon"
                color="yellow"
                description="Valoración general"
              />
              <StatCard
                title="Visitantes"
                :value="organizadorStats.totalVisits || 0"
                icon="EyeIcon"
                color="purple"
                description="Visualizaciones"
              />
            </div>
          </div>
        </div>

        <!-- Producer Dashboard -->
        <div v-if="authStore.userRole === 'productor'" class="space-y-8">
          <div>
            <h2 class="text-xl font-semibold text-gray-900 mb-6">Panel del Productor</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                title="Mis Productos"
                :value="productorStats.totalProducts"
                icon="CubeIcon"
                color="green"
                description="Productos publicados"
              />
              <StatCard
                title="Ventas del Mes"
                :value="productorStats.monthlySales || 0"
                icon="CurrencyDollarIcon"
                color="blue"
                description="Ingresos estimados"
              />
              <StatCard
                title="Calificación"
                :value="productorStats.avgRating || 0"
                icon="StarIcon"
                color="yellow"
                description="Puntuación promedio"
              />
              <StatCard
                title="Comentarios"
                :value="productorStats.totalReviews || 0"
                icon="HeartIcon"
                color="purple"
                description="Reseñas recibidas"
              />
            </div>
          </div>
        </div>

        <!-- Visitante Dashboard -->
        <div v-if="authStore.userRole === 'visitante'" class="space-y-8">
          <div>
            <h2 class="text-xl font-semibold text-gray-900 mb-6">Panel del Visitante</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                title="Productos Explorados"
                :value="visitanteStats.totalProducts"
                icon="CubeIcon"
                color="blue"
                description="Disponibles para conocer"
              />
              <StatCard
                title="Mis Encuestas"
                :value="visitanteStats.mySurveys"
                icon="ClipboardDocumentListIcon"
                color="green"
                description="Completadas por mí"
              />
              <StatCard
                title="Favoritos"
                :value="visitanteStats.favorites || 0"
                icon="HeartIcon"
                color="red"
                description="Productos que me gustan"
              />
              <StatCard
                title="Tiempo Navegando"
                :value="sessionDuration"
                icon="ClockIcon"
                color="purple"
                description="En esta sesión"
              />
            </div>
          </div>
        </div>

        <!-- User Info Card -->
        <div class="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
          <h2 class="text-xl font-semibold text-gray-900 mb-6">Información de la Sesión</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 class="text-sm font-medium text-gray-700 mb-2">Datos del Usuario</h3>
              <dl class="space-y-1">
                <div class="flex justify-between">
                  <dt class="text-sm text-gray-500">Nombre:</dt>
                  <dd class="text-sm font-medium text-gray-900">{{ authStore.user?.nombre }}</dd>
                </div>
                <div class="flex justify-between">
                  <dt class="text-sm text-gray-500">Email:</dt>
                  <dd class="text-sm font-medium text-gray-900">{{ authStore.user?.email }}</dd>
                </div>
                <div class="flex justify-between">
                  <dt class="text-sm text-gray-500">Rol:</dt>
                  <dd class="text-sm font-medium text-gray-900 capitalize">{{ authStore.user?.rol }}</dd>
                </div>
                <div class="flex justify-between">
                  <dt class="text-sm text-gray-500">Registro:</dt>
                  <dd class="text-sm font-medium text-gray-900">{{ formatDateTime(authStore.user?.fechaRegistro) }}</dd>
                </div>
              </dl>
            </div>
            <div>
              <h3 class="text-sm font-medium text-gray-700 mb-2">Estadísticas de Uso</h3>
              <dl class="space-y-1">
                <div class="flex justify-between">
                  <dt class="text-sm text-gray-500">Tiempo online:</dt>
                  <dd class="text-sm font-medium text-gray-900">{{ sessionDuration }}</dd>
                </div>
                <div class="flex justify-between">
                  <dt class="text-sm text-gray-500">Último acceso:</dt>
                  <dd class="text-sm font-medium text-gray-900">{{ formatDateTime(authStore.user?.ultimoAcceso) }}</dd>
                </div>
                <div class="flex justify-between">
                  <dt class="text-sm text-gray-500">Sesión única:</dt>
                  <dd class="text-sm font-medium text-gray-900">
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      Activa
                    </span>
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useAdminStore } from '@/stores/admin'
import AppLayout from '@/components/layout/AppLayout.vue'
import StatCard from '@/components/ui/StatCard.vue'
import { toast } from '@/utils/toast'

const router = useRouter()
const authStore = useAuthStore()
const adminStore = useAdminStore()

// Reactive data
const statsLoading = ref(false)
const loginTime = ref(new Date())

// Stats data for different roles
const organizadorStats = ref({
  totalProducts: 0,
  totalSurveys: 0,
  avgRating: 0,
  totalVisits: 0
})

const productorStats = ref({
  totalProducts: 0,
  monthlySales: 0,
  avgRating: 0,
  totalReviews: 0
})

const visitanteStats = ref({
  totalProducts: 0,
  mySurveys: 0,
  favorites: 0
})

// Computed properties
const isDevelopment = computed(() => {
  return import.meta.env.DEV
})

const sessionDuration = computed(() => {
  const now = new Date()
  const diff = now - loginTime.value
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(minutes / 60)
  
  if (hours > 0) {
    return `${hours}h ${minutes % 60}m`
  }
  return `${minutes}m`
})

const usersTrend = computed(() => {
  if (adminStore.dashboardStats?.totalUsers > 50) return 'up'
  if (adminStore.dashboardStats?.totalUsers < 10) return 'down'
  return 'stable'
})

const productsTrend = computed(() => {
  if (adminStore.dashboardStats?.totalProducts > 20) return 'up'
  if (adminStore.dashboardStats?.totalProducts < 5) return 'down'
  return 'stable'
})

// Methods
const formatDateTime = (dateString) => {
  if (!dateString) return 'No disponible'
  const date = new Date(dateString)
  return date.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const loadStats = async () => {
  try {
    statsLoading.value = true
    
    if (authStore.userRole === 'administrador') {
      await adminStore.fetchDashboardStats()
    } else if (authStore.userRole === 'organizador') {
      await loadOrganizadorStats()
    } else if (authStore.userRole === 'productor') {
      await loadProductorStats()
    } else if (authStore.userRole === 'visitante') {
      await loadVisitanteStats()
    }
  } catch (error) {
    console.error('Error loading stats:', error)
    toast.error('Error al cargar estadísticas')
  } finally {
    statsLoading.value = false
  }
}

const loadOrganizadorStats = async () => {
  // Implementation for organizador stats
  organizadorStats.value = {
    totalProducts: 25,
    totalSurveys: 150,
    avgRating: 4.5,
    totalVisits: 1200
  }
}

const loadProductorStats = async () => {
  // Implementation for productor stats
  productorStats.value = {
    totalProducts: 8,
    monthlySales: 2500,
    avgRating: 4.8,
    totalReviews: 45
  }
}

const loadVisitanteStats = async () => {
  // Implementation for visitante stats
  visitanteStats.value = {
    totalProducts: 150,
    mySurveys: 5,
    favorites: 12
  }
}

// Lifecycle
onMounted(() => {
  console.log('Dashboard mounted')
  console.log('User role:', authStore.userRole)
  console.log('User data:', authStore.user)
  console.log('Is admin:', authStore.userRole === 'administrador')
  loadStats()
})
</script>
