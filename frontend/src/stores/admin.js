import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from 'axios'
import { toast } from '@/utils/toast'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://172.80.15.89:3000/api'

// Configurar axios para incluir el token automáticamente
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export const useAdminStore = defineStore('admin', () => {
  // State
  const isLoading = ref(false)
  const dashboardStats = ref(null)
  const activeSessions = ref([])
  const users = ref([])
  const pagination = ref({
    currentPage: 1,
    totalPages: 1,
    totalUsers: 0,
    hasNextPage: false,
    hasPrevPage: false
  })

  // Getters
  const totalActiveSessions = computed(() => activeSessions.value.length)
  const adminUsers = computed(() => users.value.filter(u => u.rol === 'administrador'))
  const organizadorUsers = computed(() => users.value.filter(u => u.rol === 'organizador'))
  const productorUsers = computed(() => users.value.filter(u => u.rol === 'productor'))
  const visitanteUsers = computed(() => users.value.filter(u => u.rol === 'visitante'))

  // Dashboard Stats Actions
  const fetchDashboardStats = async () => {
    try {
      isLoading.value = true
      console.log('Fetching dashboard stats from:', `${API_BASE_URL}/admin/dashboard-stats`)
      
      const response = await axios.get(`${API_BASE_URL}/admin/dashboard-stats`)
      console.log('Dashboard stats response:', response.data)
      
      if (response.data.success) {
        dashboardStats.value = response.data.data
        console.log('Dashboard stats set:', dashboardStats.value)
        return { success: true, data: response.data.data }
      }
    } catch (error) {
      console.error('Dashboard stats error:', error)
      const message = error.response?.data?.message || 'Error obteniendo estadísticas'
      toast.error(message)
      return { success: false, message }
    } finally {
      isLoading.value = false
    }
  }

  // Session Management Actions
  const fetchActiveSessions = async () => {
    try {
      isLoading.value = true
      console.log('Fetching active sessions from:', `${API_BASE_URL}/admin/active-sessions`)
      
      const response = await axios.get(`${API_BASE_URL}/admin/active-sessions`)
      console.log('Active sessions response:', response.data)
      
      if (response.data.success) {
        activeSessions.value = response.data.data.sessions
        console.log('Active sessions set:', activeSessions.value)
        return { success: true, sessions: response.data.data.sessions }
      }
    } catch (error) {
      console.error('Active sessions error:', error)
      const message = error.response?.data?.message || 'Error obteniendo sesiones activas'
      toast.error(message)
      return { success: false, message }
    } finally {
      isLoading.value = false
    }
  }

  const terminateSession = async (sessionId) => {
    try {
      console.log('Store terminateSession called with sessionId:', sessionId)
      console.log('Making DELETE request to:', `${API_BASE_URL}/admin/sessions/${sessionId}`)
      
      const response = await axios.delete(`${API_BASE_URL}/admin/sessions/${sessionId}`)
      console.log('Delete session response:', response.data)
      
      if (response.data.success) {
        // Remover sesión de la lista local
        const originalLength = activeSessions.value.length
        activeSessions.value = activeSessions.value.filter(s => s.sessionId !== sessionId)
        console.log(`Sessions removed from local list: ${originalLength} -> ${activeSessions.value.length}`)
        
        toast.success(response.data.message)
        return { success: true }
      }
    } catch (error) {
      console.error('Store terminateSession error:', error)
      const message = error.response?.data?.message || 'Error terminando sesión'
      toast.error(message)
      return { success: false, message }
    }
  }

  const terminateUserSessions = async (userId) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/admin/users/${userId}/sessions`)
      
      if (response.data.success) {
        // Remover todas las sesiones del usuario de la lista local
        activeSessions.value = activeSessions.value.filter(s => s.user.id !== userId)
        toast.success(response.data.message)
        return { success: true }
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Error terminando sesiones del usuario'
      toast.error(message)
      return { success: false, message }
    }
  }

  // User Management Actions
  const fetchUsers = async (filters = {}) => {
    try {
      isLoading.value = true
      const params = new URLSearchParams()
      
      if (filters.page) params.append('page', filters.page)
      if (filters.limit) params.append('limit', filters.limit)
      if (filters.role && filters.role !== 'all') params.append('role', filters.role)
      if (filters.status && filters.status !== 'all') params.append('status', filters.status)
      if (filters.search) params.append('search', filters.search)

      const response = await axios.get(`${API_BASE_URL}/admin/users?${params}`)
      
      if (response.data.success) {
        users.value = response.data.data.users
        pagination.value = response.data.data.pagination
        return { success: true, data: response.data.data }
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Error obteniendo usuarios'
      toast.error(message)
      return { success: false, message }
    } finally {
      isLoading.value = false
    }
  }

  const createUser = async (userData) => {
    try {
      isLoading.value = true
      console.log('Store createUser called with:', userData)
      console.log('API URL:', `${API_BASE_URL}/admin/users`)
      
      const response = await axios.post(`${API_BASE_URL}/admin/users`, userData)
      console.log('Create user response:', response.data)
      
      if (response.data.success) {
        toast.success(response.data.message)
        // Refrescar lista de usuarios
        await fetchUsers()
        return { success: true, user: response.data.data.user }
      }
    } catch (error) {
      console.error('Store createUser error:', error)
      console.error('Error response:', error.response?.data)
      
      const message = error.response?.data?.message || 'Error creando usuario'
      const errors = error.response?.data?.errors || []
      toast.error(message)
      return { success: false, message, errors }
    } finally {
      isLoading.value = false
    }
  }

  const updateUser = async (userId, userData) => {
    try {
      isLoading.value = true
      const response = await axios.put(`${API_BASE_URL}/admin/users/${userId}`, userData)
      
      if (response.data.success) {
        toast.success(response.data.message)
        
        // Actualizar usuario en la lista local
        const index = users.value.findIndex(u => u._id === userId)
        if (index !== -1) {
          users.value[index] = { ...users.value[index], ...response.data.data.user }
        }
        
        return { success: true, user: response.data.data.user }
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Error actualizando usuario'
      toast.error(message)
      return { success: false, message }
    } finally {
      isLoading.value = false
    }
  }

  const deleteUser = async (userId) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/admin/users/${userId}`)
      
      if (response.data.success) {
        toast.success(response.data.message)
        
        // Remover usuario de la lista local
        users.value = users.value.filter(u => u._id !== userId)
        
        // También remover sus sesiones activas
        activeSessions.value = activeSessions.value.filter(s => s.user.id !== userId)
        
        return { success: true }
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Error eliminando usuario'
      toast.error(message)
      return { success: false, message }
    }
  }

  const toggleUserStatus = async (userId, currentStatus) => {
    return await updateUser(userId, { activo: !currentStatus })
  }

  // Utility functions
  const refreshAll = async () => {
    await Promise.all([
      fetchDashboardStats(),
      fetchActiveSessions(),
      fetchUsers()
    ])
  }

  const clearData = () => {
    dashboardStats.value = null
    activeSessions.value = []
    users.value = []
    pagination.value = {
      currentPage: 1,
      totalPages: 1,
      totalUsers: 0,
      hasNextPage: false,
      hasPrevPage: false
    }
  }

  // User Management Actions
  const fetchUserStats = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/admin/user-stats`)
      
      if (response.data.success) {
        return { success: true, data: response.data.data }
      } else {
        console.error('Error fetching user stats:', response.data.message)
        return { success: false, error: response.data.message }
      }
    } catch (error) {
      console.error('Error fetching user stats:', error)
      return { success: false, error: error.message }
    }
  }

  const fetchRoles = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/admin/roles`)
      
      if (response.data.success) {
        return { success: true, data: response.data.data }
      } else {
        console.error('Error fetching roles:', response.data.message)
        return { success: false, error: response.data.message }
      }
    } catch (error) {
      console.error('Error fetching roles:', error)
      return { success: false, error: error.message }
    }
  }

  const changeUserRole = async (userId, newRole) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/admin/users/${userId}/role`, {
        rol: newRole
      })
      
      if (response.data.success) {
        // Actualizar el usuario en el store local
        const userIndex = users.value.findIndex(u => u._id === userId)
        if (userIndex !== -1) {
          users.value[userIndex].rol = newRole
        }
        return { success: true, data: response.data.data }
      } else {
        console.error('Error changing user role:', response.data.message)
        return { success: false, error: response.data.message }
      }
    } catch (error) {
      console.error('Error changing user role:', error)
      return { success: false, error: error.message }
    }
  }

  const toggleUserStatusAction = async (userId) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/admin/users/${userId}/status`)
      
      if (response.data.success) {
        // Actualizar el usuario en el store local
        const userIndex = users.value.findIndex(u => u._id === userId)
        if (userIndex !== -1) {
          users.value[userIndex].activo = response.data.data.activo
        }
        return { success: true, data: response.data.data }
      } else {
        console.error('Error toggling user status:', response.data.message)
        return { success: false, error: response.data.message }
      }
    } catch (error) {
      console.error('Error toggling user status:', error)
      return { success: false, error: error.message }
    }
  }

  return {
    // State
    isLoading,
    dashboardStats,
    activeSessions,
    users,
    pagination,
    
    // Getters
    totalActiveSessions,
    adminUsers,
    organizadorUsers,
    productorUsers,
    visitanteUsers,
    
    // Actions
    fetchDashboardStats,
    fetchActiveSessions,
    terminateSession,
    terminateUserSessions,
    fetchUsers,
    createUser,
    updateUser,
    deleteUser,
    toggleUserStatus,
    refreshAll,
    clearData,
    
    // New User Management Actions
    fetchUserStats,
    fetchRoles,
    changeUserRole,
    toggleUserStatusAction
  }
})
