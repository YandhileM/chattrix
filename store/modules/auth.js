import { defineStore } from 'pinia'
import { ref } from 'vue'
import { authService } from '@/services/authService'

export const useAuthStore = defineStore('auth', () => {
  // State
  const authData = ref(null) // Store complete login response
  const isAuthenticated = ref(false)
  const token = ref(null)
  const isLoading = ref(false)

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
      authData.value = response // Store complete response
      token.value = response.token
      isAuthenticated.value = true

      console.log('Login successful:', response)
      return response
    } catch (error) {
      // Reset state on login failure
      authData.value = null
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
    authData.value = null
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
    authData,
    isAuthenticated,
    token,
    isLoading,

    // Actions
    login,
    logout,
    initializeAuth,
  }
})

export default useAuthStore
