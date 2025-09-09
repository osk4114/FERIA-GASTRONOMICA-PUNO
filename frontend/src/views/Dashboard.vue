<template>
  <AppLayout>
    <div class="space-y-6">
      <!-- Header -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p class="text-gray-600">Bienvenido, {{ authStore.user?.nombre }}</p>
          </div>
          <div class="text-right">
            <p class="text-sm text-gray-500">{{ new Date().toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) }}</p>
            <p class="text-xs text-gray-400">{{ new Date().toLocaleTimeString('es-ES') }}</p>
          </div>
        </div>
      </div>

      <!-- Debug Info -->
      <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
        <h3 class="font-medium text-yellow-800">Debug Info:</h3>
        <p class="text-sm text-yellow-700">Usuario: {{ authStore.user?.nombre }}</p>
        <p class="text-sm text-yellow-700">Email: {{ authStore.user?.email }}</p>
        <p class="text-sm text-yellow-700">Rol: {{ authStore.userRole }}</p>
        <p class="text-sm text-yellow-700">Es Admin: {{ authStore.userRole === 'administrador' }}</p>
        <p class="text-sm text-yellow-700">Token: {{ authStore.token ? 'Presente' : 'Ausente' }}</p>
        <p class="text-sm text-yellow-700">Autenticado: {{ authStore.isAuthenticated }}</p>
      </div>

      <!-- Admin Dashboard -->
      <div v-if="authStore.userRole === 'administrador'" class="space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
          <StatCard
            title="Total Usuarios"
            :value="adminStore.dashboardStats?.totalUsers || 0"
            icon="UsersIcon"
            color="blue"
            :loading="statsLoading"
          />
          <StatCard
            title="Sesiones Activas"
            :value="adminStore.dashboardStats?.activeSessions || 0"
            icon="ShieldCheckIcon"
            color="green"
            :loading="statsLoading"
          />
          <StatCard
            title="Productos"
            :value="adminStore.dashboardStats?.totalProducts || 0"
            icon="CubeIcon"
            color="purple"
            :loading="statsLoading"
          />
          <StatCard
            title="Reportes"
            :value="adminStore.dashboardStats?.totalReports || 0"
            icon="DocumentTextIcon"
            color="yellow"
            :loading="statsLoading"
          />
        </div>

        <!-- Admin Quick Actions -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">Acciones Rápidas</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <QuickActionCard
              title="Gestionar Usuarios"
              description="Crear y administrar usuarios"
              icon="UsersIcon"
              color="blue"
              @click="navigateTo('/admin/users')"
            />
            <QuickActionCard
              title="Gestionar Sesiones"
              description="Controlar sesiones activas"
              icon="ShieldCheckIcon"
              color="red"
              @click="navigateTo('/admin/sessions')"
            />
            <QuickActionCard
              title="Gestionar Productos"
              description="Gestionar productos del sistema"
              icon="CubeIcon"
              color="yellow"
              @click="navigateTo('/products')"
            />
            <QuickActionCard
              title="Reportes"
              description="Ver reportes y estadísticas"
              icon="ChartBarIcon"
              color="purple"
              @click="navigateTo('/reports')"
            />
          </div>
        </div>

        <!-- System Health -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">Estado del Sistema</h2>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="text-center">
              <div class="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg mx-auto mb-2">
                <CheckCircleIcon class="h-6 w-6 text-green-600" />
              </div>
              <p class="text-sm font-medium text-gray-900">Sistema</p>
              <p class="text-xs text-green-600">Funcionando</p>
            </div>
            <div class="text-center">
              <div class="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mx-auto mb-2">
                <ServerIcon class="h-6 w-6 text-blue-600" />
              </div>
              <p class="text-sm font-medium text-gray-900">Base de Datos</p>
              <p class="text-xs text-blue-600">Conectada</p>
            </div>
            <div class="text-center">
              <div class="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg mx-auto mb-2">
                <ShieldCheckIcon class="h-6 w-6 text-purple-600" />
              </div>
              <p class="text-sm font-medium text-gray-900">Seguridad</p>
              <p class="text-xs text-purple-600">Activa</p>
            </div>
          </div>
        </div>

        <!-- Recent Activity -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">Actividad Reciente</h2>
          <div class="space-y-3">
            <div v-for="session in adminStore.activeSessions.slice(0, 5)" :key="session.sessionId" 
                 class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div class="flex items-center space-x-3">
                <div class="flex-shrink-0">
                  <div class="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <UserIcon class="h-4 w-4 text-green-600" />
                  </div>
                </div>
                <div>
                  <p class="text-sm font-medium text-gray-900">{{ session.user.nombre }}</p>
                  <p class="text-xs text-gray-500">{{ session.user.rol }} • {{ formatDateTime(session.createdAt) }}</p>
                </div>
              </div>
              <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Activo
              </span>
            </div>
            <div v-if="adminStore.activeSessions.length === 0" class="text-center text-gray-500 py-4">
              No hay sesiones activas
            </div>
          </div>
        </div>
      </div>

      <!-- Organizador Dashboard -->
      <div v-else-if="authStore.userRole === 'organizador'" class="space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard
            title="Eventos"
            :value="0"
            icon="CalendarIcon"
            color="blue"
            :loading="statsLoading"
          />
          <StatCard
            title="Participantes"
            :value="0"
            icon="UsersIcon"
            color="green"
            :loading="statsLoading"
          />
          <StatCard
            title="Encuestas"
            :value="0"
            icon="ClipboardDocumentListIcon"
            color="purple"
            :loading="statsLoading"
          />
        </div>

        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">Panel de Organización</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <QuickActionCard
              title="Gestionar Eventos"
              description="Crear y administrar eventos"
              icon="CalendarIcon"
              color="blue"
              @click="navigateTo('/events')"
            />
            <QuickActionCard
              title="Ver Reportes"
              description="Analizar estadísticas"
              icon="ChartBarIcon"
              color="green"
              @click="navigateTo('/reports')"
            />
          </div>
        </div>
      </div>

      <!-- Productor Dashboard -->
      <div v-else-if="authStore.userRole === 'productor'" class="space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard
            title="Mis Productos"
            :value="0"
            icon="CubeIcon"
            color="blue"
            :loading="statsLoading"
          />
          <StatCard
            title="Ventas"
            :value="0"
            icon="CurrencyDollarIcon"
            color="green"
            :loading="statsLoading"
          />
          <StatCard
            title="Valoraciones"
            :value="0"
            icon="StarIcon"
            color="yellow"
            :loading="statsLoading"
          />
        </div>

        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">Panel del Productor</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <QuickActionCard
              title="Mis Productos"
              description="Gestionar productos"
              icon="CubeIcon"
              color="blue"
              @click="navigateTo('/my-products')"
            />
            <QuickActionCard
              title="Mis Ventas"
              description="Ver ventas y ganancias"
              icon="CurrencyDollarIcon"
              color="green"
              @click="navigateTo('/my-sales')"
            />
          </div>
        </div>
      </div>

      <!-- Visitante Dashboard -->
      <div v-else-if="authStore.userRole === 'visitante'" class="space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard
            title="Productos"
            :value="0"
            icon="CubeIcon"
            color="blue"
            :loading="statsLoading"
          />
          <StatCard
            title="Mis Encuestas"
            :value="0"
            icon="ClipboardDocumentListIcon"
            color="green"
            :loading="statsLoading"
          />
          <StatCard
            title="Favoritos"
            :value="0"
            icon="HeartIcon"
            color="red"
            :loading="statsLoading"
          />
        </div>

        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">Explora la Feria</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <QuickActionCard
              title="Ver Productos"
              description="Explorar productos"
              icon="CubeIcon"
              color="blue"
              @click="navigateTo('/products')"
            />
            <QuickActionCard
              title="Completar Encuesta"
              description="Comparte tu opinión"
              icon="ClipboardDocumentListIcon"
              color="green"
              @click="navigateTo('/survey')"
            />
          </div>
        </div>
      </div>

      <!-- Session Info (All Roles) -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">Información de Sesión</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 class="text-sm font-medium text-gray-700 mb-2">Detalles de la Cuenta</h3>
            <dl class="space-y-1">
              <div class="flex justify-between">
                <dt class="text-sm text-gray-500">Usuario:</dt>
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
                <dt class="text-sm text-gray-500">Estado:</dt>
                <dd class="text-sm">
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Activo
                  </span>
                </dd>
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
  </AppLayout>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useAdminStore } from '@/stores/admin'
import AppLayout from '@/components/layout/AppLayout.vue'
import StatCard from '@/components/ui/StatCard.vue'
import QuickActionCard from '@/components/ui/QuickActionCard.vue'
import { toast } from '@/utils/toast'

// Heroicons
import { 
  UsersIcon, 
  CubeIcon, 
  ClipboardDocumentListIcon,
  UserIcon,
  CalendarIcon,
  ChartBarIcon,
  CurrencyDollarIcon,
  StarIcon,
  HeartIcon,
  CheckCircleIcon,
  ServerIcon,
  ShieldCheckIcon,
  DocumentTextIcon
} from '@heroicons/vue/24/outline'

const router = useRouter()
const authStore = useAuthStore()
const adminStore = useAdminStore()

// Reactive data
const statsLoading = ref(false)
const loginTime = ref(new Date())

// Computed properties
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

// Methods
const navigateTo = (path) => {
  router.push(path)
}

const formatDateTime = (date) => {
  if (!date) return 'No disponible'
  return new Date(date).toLocaleString('es-ES', {
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
      console.log('Loading admin stats...')
      await adminStore.fetchDashboardStats()
      await adminStore.fetchActiveSessions()
      console.log('Admin stats loaded:', adminStore.dashboardStats)
      console.log('Active sessions:', adminStore.activeSessions)
    }
  } catch (error) {
    console.error('Error loading stats:', error)
    toast.error('Error al cargar estadísticas')
  } finally {
    statsLoading.value = false
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
