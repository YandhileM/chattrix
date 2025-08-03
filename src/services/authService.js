import api from './api.js'

// authService methods
export const authService = {
  async login(credentials) {
    try {
      const response = await api.post('/auth/login', credentials)
      return response.data
    } catch (error) {
      throw new Error('Login failed: ' + error.message)
    }
  },
    async register(userData) {
    try {
      const response = await api.post('/auth/register', userData)
      return response.data
    } catch (error) {
      console.error('Registration error:', error)
      throw error
    }
  },
}
