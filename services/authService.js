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
}
