<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Sidebar -->
    <div 
      :class="[
        'fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full',
        'lg:translate-x-0 lg:static lg:inset-0'
      ]"
    >
      <!-- Logo -->
      <div class="flex items-center justify-center h-16 px-4 bg-primary-600">
        <h1 class="text-white text-xl font-bold">Feria Gastronómica</h1>
      </div>
      
      <!-- Navigation -->
      <nav class="mt-8 px-4">
        <div class="space-y-2">
          <router-link
            v-for="item in navigationItems"
            :key="item.name"
            :to="item.path"
            :class="[
              'sidebar-item',
              $route.name === item.name ? 'active' : ''
            ]"
            @click="closeSidebarOnMobile"
          >
            <component :is="item.icon" class="w-5 h-5 mr-3" />
            {{ item.label }}
          </router-link>
        </div>
      </nav>
      
      <!-- User info -->
      <div class="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
        <div class="flex items-center">
          <div class="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
            <UserIcon class="w-5 h-5 text-primary-600" />
          </div>
          <div class="ml-3">
            <p class="text-sm font-medium text-gray-700">{{ authStore.userName }}</p>
            <p class="text-xs text-gray-500 capitalize">{{ authStore.userRole }}</p>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Overlay for mobile -->
    <div 
      v-if="sidebarOpen"
      class="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
      @click="sidebarOpen = false"
    ></div>
    
    <!-- Main content -->
    <div class="lg:ml-64">
      <!-- Top bar -->
      <header class="bg-white shadow-sm border-b border-gray-200">
        <div class="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
          <!-- Mobile menu button -->
          <button
            @click="sidebarOpen = !sidebarOpen"
            class="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
          >
            <Bars3Icon class="w-6 h-6" />
          </button>
          
          <!-- Page title -->
          <div class="flex-1 lg:flex-none">
            <h2 class="text-xl font-semibold text-gray-900">{{ pageTitle }}</h2>
          </div>
          
          <!-- User menu -->
          <div class="flex items-center space-x-4">
            <!-- Session status -->
            <div class="flex items-center">
              <div 
                :class="[
                  'w-2 h-2 rounded-full mr-2',
                  authStore.sessionStatus === 'active' ? 'bg-success-500' : 'bg-error-500'
                ]"
              ></div>
              <span class="text-sm text-gray-600">
                {{ authStore.sessionStatus === 'active' ? 'Conectado' : 'Desconectado' }}
              </span>
            </div>
            
            <!-- Profile dropdown -->
            <div class="relative" ref="dropdown">
              <button
                @click="dropdownOpen = !dropdownOpen"
                class="flex items-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
              >
                <UserCircleIcon class="w-8 h-8" />
              </button>
              
              <div
                v-if="dropdownOpen"
                class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50 border border-gray-200"
              >
                <div class="py-1">
                  <router-link
                    to="/profile"
                    class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    @click="dropdownOpen = false"
                  >
                    Mi Perfil
                  </router-link>
                  <button
                    @click="handleLogout"
                    class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Cerrar Sesión
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
      
      <!-- Page content -->
      <main class="p-4 sm:p-6 lg:p-8">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import {
  Bars3Icon,
  UserIcon,
  UserCircleIcon,
  HomeIcon,
  CubeIcon,
  DocumentTextIcon,
  ClipboardDocumentListIcon,
  UsersIcon,
  ShieldCheckIcon
} from '@heroicons/vue/24/outline'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const sidebarOpen = ref(false)
const dropdownOpen = ref(false)
const dropdown = ref(null)

const pageTitle = computed(() => {
  return route.meta.title || 'Dashboard'
})

const navigationItems = computed(() => {
  const allItems = [
    {
      name: 'Dashboard',
      path: '/dashboard',
      label: 'Dashboard',
      icon: HomeIcon,
      roles: ['administrador', 'organizador', 'visitante', 'productor']
    },
    {
      name: 'Products',
      path: '/products',
      label: 'Productos',
      icon: CubeIcon,
      roles: ['administrador', 'organizador', 'productor']
    },
    {
      name: 'Reports',
      path: '/reports',
      label: 'Reportes',
      icon: DocumentTextIcon,
      roles: ['administrador', 'organizador']
    },
    {
      name: 'Surveys',
      path: '/surveys',
      label: 'Encuestas',
      icon: ClipboardDocumentListIcon,
      roles: ['administrador', 'organizador', 'visitante']
    },
    {
      name: 'UserManagement',
      path: '/admin/users',
      label: 'Gestión de Usuarios',
      icon: UsersIcon,
      roles: ['administrador']
    },
    {
      name: 'SessionManagement',
      path: '/admin/sessions',
      label: 'Gestión de Sesiones',
      icon: ShieldCheckIcon,
      roles: ['administrador']
    },
    {
      name: 'Users',
      path: '/users',
      label: 'Usuarios',
      icon: UsersIcon,
      roles: ['organizador']
    }
  ]
  
  return allItems.filter(item => 
    item.roles.includes(authStore.userRole)
  )
})

const closeSidebarOnMobile = () => {
  if (window.innerWidth < 1024) {
    sidebarOpen.value = false
  }
}

const handleLogout = async () => {
  dropdownOpen.value = false
  await authStore.logout()
  router.push('/login')
}

const handleClickOutside = (event) => {
  if (dropdown.value && !dropdown.value.contains(event.target)) {
    dropdownOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>
