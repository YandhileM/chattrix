// store/modules/users.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { userService } from '@/services/userService'

export const useUsersStore = defineStore('users', () => {
  // State
  const users = ref([])
  const isLoading = ref(false)
  const error = ref(null)
  const searchQuery = ref('')

  // Actions
  const fetchUsers = async () => {
    isLoading.value = true
    error.value = null
    
    try {
      const response = await userService.getOtherUsers()
      users.value = response
      console.log('Users fetched:', response)
    } catch (err) {
      error.value = err.message || 'Failed to fetch users'
      console.error('Error fetching users:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const setSearchQuery = (query) => {
    searchQuery.value = query
  }

  const clearError = () => {
    error.value = null
  }

  const clearUsers = () => {
    users.value = []
    searchQuery.value = ''
  }

  // Getters
  const filteredUsers = computed(() => {
    if (!searchQuery.value) return users.value
    
    const query = searchQuery.value.toLowerCase()
    return users.value.filter(user =>
      user.firstName?.toLowerCase().includes(query) ||
      user.lastName?.toLowerCase().includes(query) ||
      user.email?.toLowerCase().includes(query) ||
      `${user.firstName} ${user.lastName}`.toLowerCase().includes(query)
    )
  })

  const getUserById = (id) => {
    return users.value.find(user => user.id === id)
  }

  const totalUsers = computed(() => users.value.length)

  return {
    // State
    users,
    isLoading,
    error,
    searchQuery,
    
    // Actions
    fetchUsers,
    setSearchQuery,
    clearError,
    clearUsers,
    
    // Getters
    filteredUsers,
    getUserById,
    totalUsers
  }
})

export default useUsersStore