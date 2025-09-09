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
                <ChartBarIcon class="h-5 w-5 text-blue-600" />
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
                :trend="surveysTrend"
                description="Feedback recibido"
              />
            </div>
          </div>

          <!-- Analytics y Distribución -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <!-- Distribución de Usuarios -->
            <div class="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
              <div class="flex items-center justify-between mb-6">
                <h3 class="text-lg font-semibold text-gray-900 flex items-center">
                  <div class="w-6 h-6 bg-purple-100 rounded-lg flex items-center justify-center mr-2">
                    <UsersIcon class="h-4 w-4 text-purple-600" />
                  </div>
                  Distribución de Usuarios
                </h3>
                <span class="text-sm text-gray-500">Por rol</span>
              </div>
              <div class="space-y-4">
                <div v-for="role in userRoleStats" :key="role.name" class="group">
                  <div class="flex items-center justify-between mb-2">
                    <div class="flex items-center space-x-3">
                      <div :class="[
                        'w-4 h-4 rounded-full transition-all duration-200 group-hover:scale-110',
                        role.color
                      ]"></div>
                      <span class="text-sm font-medium text-gray-900 capitalize">{{ role.name }}</span>
                    </div>
                    <div class="flex items-center space-x-3">
                      <span class="text-sm font-semibold text-gray-900">{{ role.count }}</span>
                      <span class="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full">{{ role.percentage }}%</span>
                    </div>
                  </div>
                  <div class="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div 
                      :class="['h-2 rounded-full transition-all duration-500 ease-out', role.color]"
                      :style="`width: ${role.percentage}%`"
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Métricas del Sistema -->
            <div class="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
              <div class="flex items-center justify-between mb-6">
                <h3 class="text-lg font-semibold text-gray-900 flex items-center">
                  <div class="w-6 h-6 bg-green-100 rounded-lg flex items-center justify-center mr-2">
                    <CheckCircleIcon class="h-4 w-4 text-green-600" />
                  </div>
                  Estado del Sistema
                </h3>
                <div class="flex items-center space-x-2">
                  <div class="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span class="text-sm text-green-600 font-medium">Operativo</span>
                </div>
              </div>
              <div class="space-y-4">
                <div class="flex items-center justify-between p-4 bg-green-50 rounded-xl border border-green-100 hover:shadow-sm transition-shadow">
                  <div class="flex items-center space-x-3">
                    <CheckCircleIcon class="h-6 w-6 text-green-600" />
                    <div>
                      <p class="text-sm font-medium text-gray-900">Uptime del Sistema</p>
                      <p class="text-xs text-gray-500">Disponibilidad</p>
                    </div>
                  </div>
                  <span class="text-lg font-bold text-green-600">99.9%</span>
                </div>
                
                <div class="flex items-center justify-between p-4 bg-blue-50 rounded-xl border border-blue-100 hover:shadow-sm transition-shadow">
                  <div class="flex items-center space-x-3">
                    <ServerIcon class="h-6 w-6 text-blue-600" />
                    <div>
                      <p class="text-sm font-medium text-gray-900">Base de Datos</p>
                      <p class="text-xs text-gray-500">MongoDB Atlas</p>
                    </div>
                  </div>
                  <span class="text-sm font-semibold text-blue-600">Conectada</span>
                </div>
                
                <div class="flex items-center justify-between p-4 bg-purple-50 rounded-xl border border-purple-100 hover:shadow-sm transition-shadow">
                  <div class="flex items-center space-x-3">
                    <ShieldCheckIcon class="h-6 w-6 text-purple-600" />
                    <div>
                      <p class="text-sm font-medium text-gray-900">Seguridad</p>
                      <p class="text-xs text-gray-500">Nivel de sesiones</p>
                    </div>
                  </div>
                  <span class="text-sm font-semibold text-purple-600">{{ sessionSecurityLevel }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Acciones Rápidas -->
          <div class="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
            <div class="flex items-center justify-between mb-6">
              <h3 class="text-lg font-semibold text-gray-900 flex items-center">
                <div class="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center mr-2">
                  <svg class="h-4 w-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                Acciones Rápidas
              </h3>
              <span class="text-sm text-gray-500">Gestión administrativa</span>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div @click="navigateTo('/admin/users')" 
                   class="group cursor-pointer bg-gradient-to-br from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 rounded-xl p-6 border border-blue-200 hover:border-blue-300 transition-all duration-200 hover:shadow-lg transform hover:-translate-y-1">
                <div class="flex items-center space-x-3 mb-3">
                  <div class="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                    <UsersIcon class="h-5 w-5 text-white" />
                  </div>
                  <h4 class="font-semibold text-gray-900">Usuarios</h4>
                </div>
                <p class="text-sm text-gray-600">Gestionar usuarios del sistema</p>
              </div>

              <div @click="navigateTo('/admin/sessions')" 
                   class="group cursor-pointer bg-gradient-to-br from-red-50 to-red-100 hover:from-red-100 hover:to-red-200 rounded-xl p-6 border border-red-200 hover:border-red-300 transition-all duration-200 hover:shadow-lg transform hover:-translate-y-1">
                <div class="flex items-center space-x-3 mb-3">
                  <div class="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                    <ShieldCheckIcon class="h-5 w-5 text-white" />
                  </div>
                  <h4 class="font-semibold text-gray-900">Sesiones</h4>
                </div>
                <p class="text-sm text-gray-600">Controlar sesiones activas</p>
              </div>

              <div @click="navigateTo('/products')" 
                   class="group cursor-pointer bg-gradient-to-br from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200 rounded-xl p-6 border border-purple-200 hover:border-purple-300 transition-all duration-200 hover:shadow-lg transform hover:-translate-y-1">
                <div class="flex items-center space-x-3 mb-3">
                  <div class="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                    <CubeIcon class="h-5 w-5 text-white" />
                  </div>
                  <h4 class="font-semibold text-gray-900">Productos</h4>
                </div>
                <p class="text-sm text-gray-600">Gestionar catálogo</p>
              </div>

              <div @click="navigateTo('/reports')" 
                   class="group cursor-pointer bg-gradient-to-br from-yellow-50 to-yellow-100 hover:from-yellow-100 hover:to-yellow-200 rounded-xl p-6 border border-yellow-200 hover:border-yellow-300 transition-all duration-200 hover:shadow-lg transform hover:-translate-y-1">
                <div class="flex items-center space-x-3 mb-3">
                  <div class="w-10 h-10 bg-yellow-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                    <ChartBarIcon class="h-5 w-5 text-white" />
                  </div>
                  <h4 class="font-semibold text-gray-900">Reportes</h4>
                </div>
                <p class="text-sm text-gray-600">Análisis y métricas</p>
              </div>
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

          <!-- Actividad Reciente -->
          <div class="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
            <div class="flex items-center justify-between mb-6">
              <h3 class="text-lg font-semibold text-gray-900 flex items-center">
                <div class="w-6 h-6 bg-green-100 rounded-lg flex items-center justify-center mr-2">
                  <svg class="h-4 w-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                Actividad Reciente
              </h3>
              <span class="text-sm text-gray-500">Últimas {{ adminStore.activeSessions.length }} sesiones</span>
            </div>
            <div class="space-y-3">
              <div v-for="session in adminStore.activeSessions.slice(0, 5)" :key="session.sessionId" 
                   class="group flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-xl border border-gray-200 hover:border-gray-300 transition-all duration-200">
                <div class="flex items-center space-x-4">
                  <div class="relative">
                    <div class="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <span class="text-sm font-bold text-white">{{ session.user.nombre?.charAt(0) }}</span>
                    </div>
                    <div class="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white"></div>
                  </div>
                  <div>
                    <p class="text-sm font-semibold text-gray-900">{{ session.user.nombre }}</p>
                    <p class="text-xs text-gray-500">
                      <span class="capitalize">{{ session.user.rol }}</span> • 
                      <span>{{ formatDateTime(session.createdAt) }}</span>
                    </p>
                  </div>
                </div>
                <div class="flex items-center space-x-3">
                  <div class="text-right">
                    <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      <div class="w-1.5 h-1.5 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                      Activo
                    </span>
                  </div>
                </div>
              </div>
              <div v-if="adminStore.activeSessions.length === 0" class="text-center py-8">
                <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <UserIcon class="h-8 w-8 text-gray-400" />
                </div>
                <p class="text-gray-500 text-sm">No hay sesiones activas en este momento</p>
              </div>
            </div>
          </div>
        </div>

      <!-- Organizador Dashboard -->
      <div v-else-if="authStore.userRole === 'organizador'" class="space-y-8">
        <!-- Header de Bienvenida para Organizador -->
        <div class="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 rounded-3xl text-white p-8 shadow-xl border border-indigo-200">
          <div class="flex items-center justify-between">
            <div>
              <h1 class="text-3xl font-bold mb-2">¡Hola, {{ authStore.user.nombre }}! 📊</h1>
              <p class="text-indigo-100 text-lg">Supervisa el éxito de la feria gastronómica de Puno</p>
            </div>
            <div class="hidden md:block">
              <div class="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <span class="text-3xl">📈</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Estadísticas del Organizador -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div class="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-600 mb-1">Total Encuestas</p>
                <p class="text-3xl font-bold text-gray-900">{{ organizadorStats.totalSurveys }}</p>
                <p class="text-xs text-blue-600 mt-1 flex items-center">
                  <svg class="h-3 w-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Encuestas completadas
                </p>
              </div>
              <div class="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <svg class="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-600 mb-1">Satisfacción General</p>
                <p class="text-3xl font-bold text-gray-900">{{ organizadorStats.avgSatisfaction }}</p>
                <p class="text-xs text-green-600 mt-1 flex items-center">
                  <svg class="h-3 w-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                    <path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd" />
                  </svg>
                  Puntuación promedio
                </p>
              </div>
              <div class="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <svg class="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M12 5a9 9 0 019 9 9 9 0 01-9 9 9 9 0 01-9-9 9 9 0 019-9z" />
                </svg>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-600 mb-1">Reportes Generados</p>
                <p class="text-3xl font-bold text-gray-900">{{ organizadorStats.totalReports }}</p>
                <p class="text-xs text-purple-600 mt-1 flex items-center">
                  <svg class="h-3 w-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                  Este mes
                </p>
              </div>
              <div class="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <svg class="h-6 w-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-600 mb-1">Participantes Únicos</p>
                <p class="text-3xl font-bold text-gray-900">{{ organizadorStats.uniqueParticipants }}</p>
                <p class="text-xs text-yellow-600 mt-1 flex items-center">
                  <svg class="h-3 w-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                  </svg>
                  Usuarios que participaron
                </p>
              </div>
              <div class="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                <svg class="h-6 w-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <!-- Métricas de Encuestas y Acciones -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <!-- Análisis de Satisfacción Mejorado -->
          <div class="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
            <h2 class="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <div class="w-6 h-6 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                <svg class="h-4 w-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              Análisis de Satisfacción
            </h2>
            <div class="space-y-6">
              <div class="relative">
                <div class="flex items-center justify-between mb-2">
                  <span class="text-sm font-semibold text-gray-900 flex items-center">
                    <div class="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                    Muy Satisfecho
                  </span>
                  <span class="text-sm font-bold text-gray-900">{{ organizadorStats.satisfaction?.excellent || 0 }}%</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-3">
                  <div class="bg-gradient-to-r from-green-400 to-green-600 h-3 rounded-full transition-all duration-300" 
                       :style="`width: ${organizadorStats.satisfaction?.excellent || 0}%`"></div>
                </div>
              </div>

              <div class="relative">
                <div class="flex items-center justify-between mb-2">
                  <span class="text-sm font-semibold text-gray-900 flex items-center">
                    <div class="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                    Satisfecho
                  </span>
                  <span class="text-sm font-bold text-gray-900">{{ organizadorStats.satisfaction?.good || 0 }}%</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-3">
                  <div class="bg-gradient-to-r from-blue-400 to-blue-600 h-3 rounded-full transition-all duration-300" 
                       :style="`width: ${organizadorStats.satisfaction?.good || 0}%`"></div>
                </div>
              </div>

              <div class="relative">
                <div class="flex items-center justify-between mb-2">
                  <span class="text-sm font-semibold text-gray-900 flex items-center">
                    <div class="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                    Regular
                  </span>
                  <span class="text-sm font-bold text-gray-900">{{ organizadorStats.satisfaction?.average || 0 }}%</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-3">
                  <div class="bg-gradient-to-r from-yellow-400 to-yellow-600 h-3 rounded-full transition-all duration-300" 
                       :style="`width: ${organizadorStats.satisfaction?.average || 0}%`"></div>
                </div>
              </div>

              <div class="relative">
                <div class="flex items-center justify-between mb-2">
                  <span class="text-sm font-semibold text-gray-900 flex items-center">
                    <div class="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                    Insatisfecho
                  </span>
                  <span class="text-sm font-bold text-gray-900">{{ organizadorStats.satisfaction?.poor || 0 }}%</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-3">
                  <div class="bg-gradient-to-r from-red-400 to-red-600 h-3 rounded-full transition-all duration-300" 
                       :style="`width: ${organizadorStats.satisfaction?.poor || 0}%`"></div>
                </div>
              </div>
            </div>
          </div>

          <!-- Herramientas de Gestión Modernas -->
          <div class="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
            <h2 class="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <div class="w-6 h-6 bg-indigo-100 rounded-lg flex items-center justify-center mr-3">
                <svg class="h-4 w-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
              </div>
              Herramientas de Gestión
            </h2>
            <div class="space-y-4">
              <button @click="navigateTo('/reports/generate')" 
                      class="group w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl p-4 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg">
                <div class="flex items-center justify-between">
                  <div class="flex items-center">
                    <div class="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center mr-3">
                      <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div class="text-left">
                      <p class="font-semibold">Generar Reporte</p>
                      <p class="text-blue-100 text-sm">Crear reporte personalizado</p>
                    </div>
                  </div>
                  <svg class="h-5 w-5 opacity-50 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </button>

              <button @click="navigateTo('/surveys')" 
                      class="group w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-xl p-4 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg">
                <div class="flex items-center justify-between">
                  <div class="flex items-center">
                    <div class="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center mr-3">
                      <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                      </svg>
                    </div>
                    <div class="text-left">
                      <p class="font-semibold">Ver Encuestas</p>
                      <p class="text-green-100 text-sm">Analizar feedback de visitantes</p>
                    </div>
                  </div>
                  <svg class="h-5 w-5 opacity-50 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </button>

              <button @click="navigateTo('/analytics')" 
                      class="group w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-xl p-4 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg">
                <div class="flex items-center justify-between">
                  <div class="flex items-center">
                    <div class="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center mr-3">
                      <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                    <div class="text-left">
                      <p class="font-semibold">Estadísticas Avanzadas</p>
                      <p class="text-purple-100 text-sm">Dashboard detallado</p>
                    </div>
                  </div>
                  <svg class="h-5 w-5 opacity-50 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </button>
            </div>
          </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Productor Dashboard -->
      <div v-else-if="authStore.userRole === 'productor'" class="space-y-8">
        <!-- Header de Bienvenida para Productor -->
        <div class="bg-gradient-to-r from-orange-600 via-orange-500 to-amber-500 rounded-3xl text-white p-8 shadow-xl border border-orange-200">
          <div class="flex items-center justify-between">
            <div>
              <h1 class="text-3xl font-bold mb-2">¡Hola, {{ authStore.user.nombre }}! 🍲</h1>
              <p class="text-orange-100 text-lg">Gestiona tus productos gastronómicos de manera eficiente</p>
            </div>
            <div class="hidden md:block">
              <div class="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <span class="text-3xl">👨‍🍳</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Estadísticas del Productor -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div class="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-600 mb-1">Mis Productos</p>
                <p class="text-3xl font-bold text-gray-900">{{ productorStats.totalProducts }}</p>
                <p class="text-xs text-blue-600 mt-1 flex items-center">
                  <svg class="h-3 w-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
                  </svg>
                  Productos registrados
                </p>
              </div>
              <div class="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <svg class="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-600 mb-1">Productos Activos</p>
                <p class="text-3xl font-bold text-gray-900">{{ productorStats.activeProducts }}</p>
                <p class="text-xs text-green-600 mt-1 flex items-center">
                  <svg class="h-3 w-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                  </svg>
                  Disponibles para venta
                </p>
              </div>
              <div class="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <svg class="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-600 mb-1">Valoración Promedio</p>
                <p class="text-3xl font-bold text-gray-900">{{ productorStats.avgRating }}</p>
                <p class="text-xs text-yellow-600 mt-1 flex items-center">
                  <svg class="h-3 w-3 mr-1 fill-current" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  De 5 estrellas
                </p>
              </div>
              <div class="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                <svg class="h-6 w-6 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-600 mb-1">Vistas del Mes</p>
                <p class="text-3xl font-bold text-gray-900">{{ productorStats.monthlyViews }}</p>
                <p class="text-xs text-purple-600 mt-1 flex items-center">
                  <svg class="h-3 w-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  Visualizaciones
                </p>
              </div>
              <div class="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <svg class="h-6 w-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <!-- Resumen de Productos y Acciones Rápidas -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <!-- Resumen de Productos -->
          <div class="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
            <h2 class="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <div class="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                <svg class="h-4 w-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              Resumen de Productos
            </h2>
            <div class="space-y-4">
              <div class="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl border border-blue-200">
                <div class="flex items-center">
                  <div class="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center mr-3">
                    <svg class="h-4 w-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd" />
                    </svg>
                  </div>
                  <span class="text-sm font-medium text-gray-900">Total de productos</span>
                </div>
                <span class="text-lg font-bold text-blue-600">{{ productorStats.totalProducts }}</span>
              </div>
              <div class="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-xl border border-green-200">
                <div class="flex items-center">
                  <div class="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center mr-3">
                    <svg class="h-4 w-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                    </svg>
                  </div>
                  <span class="text-sm font-medium text-gray-900">Productos disponibles</span>
                </div>
                <span class="text-lg font-bold text-green-600">{{ productorStats.activeProducts }}</span>
              </div>
              <div class="flex items-center justify-between p-4 bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-xl border border-yellow-200">
                <div class="flex items-center">
                  <div class="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center mr-3">
                    <svg class="h-4 w-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                    </svg>
                  </div>
                  <span class="text-sm font-medium text-gray-900">Productos sin stock</span>
                </div>
                <span class="text-lg font-bold text-yellow-600">{{ productorStats.outOfStock || 0 }}</span>
              </div>
            </div>
          </div>

          <!-- Acciones Rápidas Modernas -->
          <div class="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
            <h2 class="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <div class="w-6 h-6 bg-orange-100 rounded-lg flex items-center justify-center mr-3">
                <svg class="h-4 w-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              Acciones Rápidas
            </h2>
            <div class="space-y-4">
              <button @click="navigateTo('/products/new')" 
                      class="group w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl p-4 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg">
                <div class="flex items-center justify-between">
                  <div class="flex items-center">
                    <div class="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center mr-3">
                      <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    </div>
                    <div class="text-left">
                      <p class="font-semibold">Agregar Producto</p>
                      <p class="text-blue-100 text-sm">Registrar nuevo producto</p>
                    </div>
                  </div>
                  <svg class="h-5 w-5 opacity-50 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </button>

              <button @click="navigateTo('/products')" 
                      class="group w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-xl p-4 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg">
                <div class="flex items-center justify-between">
                  <div class="flex items-center">
                    <div class="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center mr-3">
                      <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                      </svg>
                    </div>
                    <div class="text-left">
                      <p class="font-semibold">Gestionar Inventario</p>
                      <p class="text-green-100 text-sm">Actualizar stock y precios</p>
                    </div>
                  </div>
                  <svg class="h-5 w-5 opacity-50 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </button>

              <button @click="navigateTo('/reports')" 
                      class="group w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-xl p-4 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg">
                <div class="flex items-center justify-between">
                  <div class="flex items-center">
                    <div class="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center mr-3">
                      <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                    <div class="text-left">
                      <p class="font-semibold">Ver Estadísticas</p>
                      <p class="text-purple-100 text-sm">Análisis de ventas y performance</p>
                    </div>
                  </div>
                  <svg class="h-5 w-5 opacity-50 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </button>
            </div>
          </div>
                description="Analizar rendimiento"
                icon="ChartBarIcon"
                color="purple"
                @click="navigateTo('/producer-stats')"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Visitante Dashboard -->
      <div v-else-if="authStore.userRole === 'visitante'" class="space-y-8">
        <!-- Header de Bienvenida para Visitante -->
        <div class="bg-gradient-to-r from-emerald-600 via-teal-500 to-cyan-500 rounded-3xl text-white p-8 shadow-xl border border-emerald-200">
          <div class="flex items-center justify-between">
            <div>
              <h1 class="text-3xl font-bold mb-2">¡Bienvenido, {{ authStore.user.nombre }}! 🎉</h1>
              <p class="text-emerald-100 text-lg">Explora la rica gastronomía de Puno y comparte tu experiencia</p>
            </div>
            <div class="hidden md:block">
              <div class="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <span class="text-3xl">🍴</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Estadísticas del Visitante -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div class="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-600 mb-1">Productos Disponibles</p>
                <p class="text-3xl font-bold text-gray-900">{{ visitanteStats.totalProducts }}</p>
                <p class="text-xs text-blue-600 mt-1 flex items-center">
                  <svg class="h-3 w-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  Para explorar
                </p>
              </div>
              <div class="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <svg class="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-600 mb-1">Mis Encuestas</p>
                <p class="text-3xl font-bold text-gray-900">{{ visitanteStats.mySurveys }}</p>
                <p class="text-xs text-green-600 mt-1 flex items-center">
                  <svg class="h-3 w-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                  </svg>
                  Completadas
                </p>
              </div>
              <div class="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <svg class="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-600 mb-1">Productos Favoritos</p>
                <p class="text-3xl font-bold text-gray-900">{{ visitanteStats.favorites }}</p>
                <p class="text-xs text-red-600 mt-1 flex items-center">
                  <svg class="h-3 w-3 mr-1 fill-current" viewBox="0 0 20 20">
                    <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
                  </svg>
                  Guardados
                </p>
              </div>
              <div class="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                <svg class="h-6 w-6 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
                </svg>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-600 mb-1">Tiempo de Sesión</p>
                <p class="text-3xl font-bold text-gray-900">{{ sessionDurationMinutes }}</p>
                <p class="text-xs text-purple-600 mt-1 flex items-center">
                  <svg class="h-3 w-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Minutos activo
                </p>
              </div>
              <div class="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <svg class="h-6 w-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <!-- Productos Destacados y Acciones -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <!-- Productos Más Populares -->
          <div class="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
            <h2 class="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <div class="w-6 h-6 bg-orange-100 rounded-lg flex items-center justify-center mr-3">
                <svg class="h-4 w-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              Productos Más Populares
            </h2>
            <div class="space-y-4">
              <div v-for="(product, index) in popularProducts" :key="product.id" 
                   class="group flex items-center justify-between p-4 bg-gray-50 hover:bg-orange-50 rounded-xl border border-gray-200 hover:border-orange-300 transition-all duration-200">
                <div class="flex items-center space-x-4">
                  <div class="relative">
                    <div class="w-12 h-12 bg-gradient-to-r from-orange-400 to-red-400 rounded-full flex items-center justify-center">
                      <span class="text-white font-bold text-lg">#{{ index + 1 }}</span>
                    </div>
                  </div>
                  <div>
                    <p class="text-sm font-semibold text-gray-900 group-hover:text-orange-700">{{ product.nombre_producto }}</p>
                    <p class="text-xs text-gray-500">{{ product.categoria }} • S/{{ product.precio }}</p>
                  </div>
                </div>
                <button @click="viewProduct(product.id)" 
                        class="px-4 py-2 bg-orange-500 text-white text-sm font-medium rounded-lg hover:bg-orange-600 transition-colors duration-200 opacity-0 group-hover:opacity-100">
                  Ver Detalle
                </button>
              </div>
              <div v-if="popularProducts.length === 0" class="text-center py-8">
                <div class="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg class="h-8 w-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <p class="text-gray-500 text-sm">Cargando productos populares...</p>
              </div>
            </div>
          </div>

          <!-- Acciones Rápidas para Visitante -->
          <div class="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
            <h2 class="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <div class="w-6 h-6 bg-emerald-100 rounded-lg flex items-center justify-center mr-3">
                <svg class="h-4 w-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              ¿Qué te gustaría hacer?
            </h2>
            <div class="space-y-4">
              <button @click="navigateTo('/products')" 
                      class="group w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl p-4 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg">
                <div class="flex items-center justify-between">
                  <div class="flex items-center">
                    <div class="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center mr-3">
                      <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                    <div class="text-left">
                      <p class="font-semibold">Explorar Productos</p>
                      <p class="text-blue-100 text-sm">Descubre la gastronomía puneña</p>
                    </div>
                  </div>
                  <svg class="h-5 w-5 opacity-50 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </button>

              <button @click="navigateTo('/surveys')" 
                      class="group w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-xl p-4 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg">
                <div class="flex items-center justify-between">
                  <div class="flex items-center">
                    <div class="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center mr-3">
                      <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                      </svg>
                    </div>
                    <div class="text-left">
                      <p class="font-semibold">Realizar Encuesta</p>
                      <p class="text-green-100 text-sm">Comparte tu experiencia</p>
                    </div>
                  </div>
                  <svg class="h-5 w-5 opacity-50 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </button>

              <button @click="navigateTo('/profile')" 
                      class="group w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-xl p-4 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg">
                <div class="flex items-center justify-between">
                  <div class="flex items-center">
                    <div class="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center mr-3">
                      <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <div class="text-left">
                      <p class="font-semibold">Mi Perfil</p>
                      <p class="text-purple-100 text-sm">Configurar cuenta y preferencias</p>
                    </div>
                  </div>
                  <svg class="h-5 w-5 opacity-50 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
              <QuickActionCard
                title="Completar Encuesta"
                description="Comparte tu experiencia"
                icon="ClipboardDocumentListIcon"
                color="green"
                @click="navigateTo('/surveys/new')"
              />
              <QuickActionCard
                title="Mis Favoritos"
                description="Ver productos guardados"
                icon="HeartIcon"
                color="red"
                @click="navigateTo('/favorites')"
              />
            </div>
          </div>
        </div>

        <!-- Recomendaciones Personalizadas -->
        <div class="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg shadow-sm border border-blue-200 p-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">Recomendaciones para ti</h2>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="text-center p-4 bg-white rounded-lg">
              <CubeIcon class="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <h3 class="font-medium text-gray-900">Platos Típicos</h3>
              <p class="text-sm text-gray-600">Prueba nuestros platos tradicionales</p>
            </div>
            <div class="text-center p-4 bg-white rounded-lg">
              <StarIcon class="h-8 w-8 text-yellow-600 mx-auto mb-2" />
              <h3 class="font-medium text-gray-900">Mejor Valorados</h3>
              <p class="text-sm text-gray-600">Los favoritos de otros visitantes</p>
            </div>
            <div class="text-center p-4 bg-white rounded-lg">
              <ClipboardDocumentListIcon class="h-8 w-8 text-green-600 mx-auto mb-2" />
              <h3 class="font-medium text-gray-900">Tu Opinión Cuenta</h3>
              <p class="text-sm text-gray-600">Ayúdanos a mejorar con tu feedback</p>
            </div>
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
import axios from 'axios'

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
  DocumentTextIcon,
  EyeIcon,
  PlusIcon,
  FaceSmileIcon,
  ClockIcon
} from '@heroicons/vue/24/outline'

const router = useRouter()
const authStore = useAuthStore()
const adminStore = useAdminStore()

// Reactive data
const statsLoading = ref(false)
const loginTime = ref(new Date())

// Stats data for different roles
const productorStats = ref({
  totalProducts: 0,
  activeProducts: 0,
  avgRating: 0,
  monthlyViews: 0,
  outOfStock: 0
})

const organizadorStats = ref({
  totalSurveys: 0,
  avgSatisfaction: 0,
  totalReports: 0,
  uniqueParticipants: 0,
  satisfaction: {
    excellent: 0,
    good: 0,
    average: 0,
    poor: 0
  }
})

const visitanteStats = ref({
  totalProducts: 0,
  mySurveys: 0,
  favorites: 0
})

const popularProducts = ref([])

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

const sessionDurationMinutes = computed(() => {
  const now = new Date()
  const diff = now - loginTime.value
  return Math.floor(diff / 60000)
})

const userRoleStats = computed(() => {
  if (!adminStore.dashboardStats?.roleStats) return []
  
  const stats = adminStore.dashboardStats.roleStats
  const total = adminStore.dashboardStats.totalUsers || 1
  
  return [
    {
      name: 'administrador',
      count: stats.administrador || 0,
      percentage: Math.round(((stats.administrador || 0) / total) * 100),
      color: 'bg-blue-500'
    },
    {
      name: 'organizador',
      count: stats.organizador || 0,
      percentage: Math.round(((stats.organizador || 0) / total) * 100),
      color: 'bg-green-500'
    },
    {
      name: 'productor',
      count: stats.productor || 0,
      percentage: Math.round(((stats.productor || 0) / total) * 100),
      color: 'bg-purple-500'
    },
    {
      name: 'visitante',
      count: stats.visitante || 0,
      percentage: Math.round(((stats.visitante || 0) / total) * 100),
      color: 'bg-yellow-500'
    }
  ]
})

const sessionSecurityLevel = computed(() => {
  const activeCount = adminStore.dashboardStats?.activeSessions || 0
  if (activeCount > 10) return 'Alto'
  if (activeCount > 5) return 'Medio'
  return 'Bajo'
})

const usersTrend = computed(() => {
  // Simulamos un trend positivo basado en datos del sistema
  return { direction: 'up', value: '+12%' }
})

const productsTrend = computed(() => {
  return { direction: 'up', value: '+8%' }
})

const surveysTrend = computed(() => {
  return { direction: 'up', value: '+15%' }
})

const isDevelopment = computed(() => {
  return import.meta.env.DEV
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
    } else if (authStore.userRole === 'productor') {
      await loadProductorStats()
    } else if (authStore.userRole === 'organizador') {
      await loadOrganizadorStats()
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

const loadProductorStats = async () => {
  try {
    // Cargar estadísticas del productor desde API
    const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api'}/products/stats/overview`)
    
    if (response.data.success) {
      const data = response.data.data
      productorStats.value = {
        totalProducts: data.totalProducts || 0,
        activeProducts: data.activeProducts || 0,
        avgRating: data.avgRating || 0,
        monthlyViews: data.monthlyViews || 0,
        outOfStock: data.outOfStock || 0
      }
    }
  } catch (error) {
    console.error('Error loading productor stats:', error)
    // Valores por defecto en caso de error
    productorStats.value = {
      totalProducts: 0,
      activeProducts: 0,
      avgRating: 4.2,
      monthlyViews: 156,
      outOfStock: 0
    }
  }
}

const loadOrganizadorStats = async () => {
  try {
    // Cargar estadísticas del organizador desde API
    const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api'}/surveys/stats`)
    
    if (response.data.success) {
      const data = response.data.data
      organizadorStats.value = {
        totalSurveys: data.totalSurveys || 0,
        avgSatisfaction: data.avgSatisfaction || 0,
        totalReports: data.totalReports || 0,
        uniqueParticipants: data.uniqueParticipants || 0,
        satisfaction: data.satisfaction || {
          excellent: 45,
          good: 35,
          average: 15,
          poor: 5
        }
      }
    }
  } catch (error) {
    console.error('Error loading organizador stats:', error)
    // Valores por defecto
    organizadorStats.value = {
      totalSurveys: 25,
      avgSatisfaction: 4.3,
      totalReports: 8,
      uniqueParticipants: 18,
      satisfaction: {
        excellent: 45,
        good: 35,
        average: 15,
        poor: 5
      }
    }
  }
}

const loadVisitanteStats = async () => {
  try {
    // Cargar productos populares y estadísticas del visitante
    const [productsResponse, surveysResponse] = await Promise.all([
      axios.get(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api'}/products`),
      axios.get(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api'}/surveys/my-surveys`)
    ])
    
    if (productsResponse.data.success) {
      const products = productsResponse.data.data.products || []
      visitanteStats.value.totalProducts = products.length
      // Tomar los primeros 3 productos como populares
      popularProducts.value = products.slice(0, 3)
    }
    
    if (surveysResponse.data.success) {
      visitanteStats.value.mySurveys = surveysResponse.data.data.surveys?.length || 0
    }
    
    // Favoritos (simulado por ahora)
    visitanteStats.value.favorites = 3
    
  } catch (error) {
    console.error('Error loading visitante stats:', error)
    // Valores por defecto
    visitanteStats.value = {
      totalProducts: 15,
      mySurveys: 2,
      favorites: 3
    }
    
    // Productos populares por defecto
    popularProducts.value = [
      { id: 1, nombre_producto: 'Quinua Real', categoria: 'plato_principal', precio: 12.50 },
      { id: 2, nombre_producto: 'Trucha Frita', categoria: 'plato_principal', precio: 25.00 },
      { id: 3, nombre_producto: 'Papa Rellena', categoria: 'entrada', precio: 8.00 }
    ]
  }
}

const viewProduct = (productId) => {
  router.push(`/products/${productId}`)
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
