// services/userService.js
import api from './api.js'

export const userService = {
  async getOtherUsers() {
    try {
      const response = await api.get('/users/other-users')
      return response.data
    } catch (error) {
      console.error('Error fetching users:', error)
      throw error
    }
  },

}

export default userService