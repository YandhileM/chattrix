import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authService } from '@/services/authService'

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref(null)
  const isAuthenticated = ref(false)
  const token = ref(null)
  const isLoading = ref(false)

  // Getters
  const isAdmin = computed(() => user.value?.role === 'admin')
  const userId = computed(() => user.value?.id)

  // Actions
  const login = async (userData) => {
    isLoading.value = true

    try {
      // Call the auth service with login credentials
      const response = await authService.login({
        email: userData.email,
        password: userData.password,
      })

      // Update store state with successful login
      user.value = response.user || {
        id: response.userId,
        email: userData.email,
        role: response.role || 'user',
      }
      token.value = response.token
      isAuthenticated.value = true

      console.log('Login successful:', response)
      return response
    } catch (error) {
      // Reset state on login failure
      user.value = null
      token.value = null
      isAuthenticated.value = false

      console.error('Login failed:', error)

      // Re-throw the error so the component can handle it
      throw new Error(error.message || 'Login failed')
    } finally {
      isLoading.value = false
    }
  }

  const logout = () => {
    user.value = null
    token.value = null
    isAuthenticated.value = false

    // Clear token from localStorage
    localStorage.removeItem('auth_token')

    console.log('User logged out')
  }

  // Initialize store from localStorage if token exists
  const initializeAuth = () => {
    const savedToken = localStorage.getItem('auth_token')
    if (savedToken) {
      token.value = savedToken
      // You might want to validate the token with your backend here
      // For now, we'll assume it's valid
      isAuthenticated.value = true
    }
  }

  return {
    // State
    user,
    isAuthenticated,
    token,
    isLoading,

    // Getters
    isAdmin,
    userId,

    // Actions
    login,
    logout,
    initializeAuth,
  }
})

export default useAuthStore
