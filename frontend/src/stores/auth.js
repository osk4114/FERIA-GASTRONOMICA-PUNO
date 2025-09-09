import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from 'axios'
import { toast } from '@/utils/toast'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api'

export const useAuthStore = defineStore('auth', () => {
  // State
  const token = ref(localStorage.getItem('token') || null)
  const user = ref(null)
  const isLoading = ref(false)
  const sessionStatus = ref(token.value ? 'checking' : 'inactive')

  // Getters
  const isAuthenticated = computed(() => !!token.value && !!user.value)
  const userRole = computed(() => user.value?.rol || null)
  const userName = computed(() => user.value?.nombre || 'Usuario')

  // Actions
  const login = async (credentials) => {
    try {
      isLoading.value = true
      
      console.log('🔍 Store recibió credentials:', credentials);
      
      // Mapear las credenciales del frontend al formato del backend
      const loginData = {
        email: credentials.email,
        contraseña: credentials.password
      }
      
      console.log('📤 Store enviando al backend:', loginData);
      console.log('📧 Email específico:', JSON.stringify(credentials.email));
      
      const response = await axios.post(`${API_BASE_URL}/auth/login`, loginData)
      
      if (response.data.success) {
        token.value = response.data.data.token
        user.value = response.data.data.user
        
        localStorage.setItem('token', response.data.data.token)
        axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.data.token}`
        
        toast.success(`¡Bienvenido ${response.data.data.user.nombre}!`)
        sessionStatus.value = 'active'
        
        return { success: true, user: response.data.data.user }
      }
    } catch (error) {
      // Manejar específicamente el error de sesión existente
      if (error.response?.status === 409 && error.response?.data?.code === 'EXISTING_SESSION') {
        const sessionInfo = error.response.data.details?.sessionInfo
        const deviceInfo = sessionInfo?.device || 'Dispositivo desconocido'
        const expiresAt = sessionInfo?.expiresAt ? new Date(sessionInfo.expiresAt).toLocaleString() : 'Desconocido'
        
        toast.error(
          `Ya tienes una sesión activa desde: ${deviceInfo}. Expira: ${expiresAt}`, 
          { 
            autoClose: 8000,
            position: 'top-center'
          }
        )
        
        return { 
          success: false, 
          message: error.response.data.message,
          code: 'EXISTING_SESSION',
          sessionInfo: sessionInfo
        }
      }
      
      // Otros errores
      const message = error.response?.data?.message || 'Error en el login'
      toast.error(message)
      return { success: false, message }
    } finally {
      isLoading.value = false
    }
  }

  const logout = async (silent = false) => {
    try {
      // Solo hacer petición al servidor si tenemos token y no es logout silencioso
      if (token.value && !silent) {
        await axios.post(`${API_BASE_URL}/auth/logout`)
      }
    } catch (error) {
      console.error('Error en logout:', error)
    } finally {
      // Limpiar estado local siempre
      token.value = null
      user.value = null
      sessionStatus.value = 'inactive'
      
      localStorage.removeItem('token')
      delete axios.defaults.headers.common['Authorization']
      
      if (!silent) {
        toast.info('Sesión cerrada')
      }
    }
  }

  const forceLogout = async (credentials) => {
    try {
      isLoading.value = true
      
      // Primero hacer logout de todas las sesiones
      const loginData = {
        email: credentials.email,
        contraseña: credentials.password
      }
      
      // Hacer una petición especial que fuerce el logout de todas las sesiones
      const response = await axios.post(`${API_BASE_URL}/auth/force-login`, loginData)
      
      if (response.data.success) {
        token.value = response.data.data.token
        user.value = response.data.data.user
        
        localStorage.setItem('token', response.data.data.token)
        axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.data.token}`
        
        toast.success(`¡Bienvenido ${response.data.data.user.nombre}! (Sesión anterior cerrada)`)
        sessionStatus.value = 'active'
        
        return { success: true, user: response.data.data.user }
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Error en el login forzado'
      toast.error(message)
      return { success: false, message }
    } finally {
      isLoading.value = false
    }
  }

  const checkSession = async () => {
    if (!token.value) {
      sessionStatus.value = 'inactive'
      return false
    }

    try {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token.value}`
      const response = await axios.get(`${API_BASE_URL}/auth/verify-session`)
      
      if (response.data.success) {
        user.value = response.data.data.user
        sessionStatus.value = 'active'
        return true
      } else {
        // Limpiar estado local sin llamar logout (evitar bucle)
        token.value = null
        user.value = null
        sessionStatus.value = 'inactive'
        localStorage.removeItem('token')
        delete axios.defaults.headers.common['Authorization']
        return false
      }
    } catch (error) {
      // No llamar logout aquí para evitar bucles
      console.error('Error verificando sesión:', error)
      
      // Solo limpiar estado local
      token.value = null
      user.value = null
      sessionStatus.value = 'inactive'
      localStorage.removeItem('token')
      delete axios.defaults.headers.common['Authorization']
      
      return false
    }
  }

  const register = async (userData) => {
    try {
      isLoading.value = true
      const response = await axios.post(`${API_BASE_URL}/auth/register`, userData)
      
      if (response.data.success) {
        toast.success('Usuario registrado exitosamente')
        return { success: true, user: response.data.user }
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Error en el registro'
      toast.error(message)
      return { success: false, message }
    } finally {
      isLoading.value = false
    }
  }

  const updateProfile = async (profileData) => {
    try {
      isLoading.value = true
      const response = await axios.put(`${API_BASE_URL}/users/profile`, profileData)
      
      if (response.data.success) {
        user.value = { ...user.value, ...response.data.user }
        toast.success('Perfil actualizado exitosamente')
        return { success: true }
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Error actualizando perfil'
      toast.error(message)
      return { success: false, message }
    } finally {
      isLoading.value = false
    }
  }

  const changePassword = async (passwordData) => {
    try {
      isLoading.value = true
      const response = await axios.put(`${API_BASE_URL}/users/change-password`, passwordData)
      
      if (response.data.success) {
        toast.success('Contraseña actualizada exitosamente')
        return { success: true }
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Error cambiando contraseña'
      toast.error(message)
      return { success: false, message }
    } finally {
      isLoading.value = false
    }
  }

  // Initialize axios interceptor for token refresh
  let isLoggingOut = false // Flag para prevenir bucles de logout
  
  const initializeInterceptors = () => {
    axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401 && token.value && !isLoggingOut) {
          isLoggingOut = true
          toast.error('Sesión expirada. Por favor, inicia sesión nuevamente.')
          
          // Limpiar estado local sin hacer petición al servidor
          token.value = null
          user.value = null
          sessionStatus.value = 'inactive'
          
          localStorage.removeItem('token')
          delete axios.defaults.headers.common['Authorization']
          
          // Resetear flag después de un delay
          setTimeout(() => {
            isLoggingOut = false
          }, 1000)
          
          window.location.href = '/login'
        }
        return Promise.reject(error)
      }
    )
  }

  return {
    // State
    token,
    user,
    isLoading,
    sessionStatus,
    
    // Getters
    isAuthenticated,
    userRole,
    userName,
    
    // Actions
    login,
    logout,
    forceLogout,
    checkSession,
    register,
    updateProfile,
    changePassword,
    initializeInterceptors
  }
})
