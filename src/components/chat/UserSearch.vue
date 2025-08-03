<template>
  <div class="user-search">
    <!-- Header -->
    <div class="user-search-header">
      <h1>Find Users</h1>
      <p class="subtitle">Connect with people on the platform</p>
    </div>

    <!-- Search Bar -->
    <div class="search-section">
      <div class="search-bar">
        <i class="pi pi-search search-icon"></i>
        <input 
          type="text" 
          v-model="searchQuery" 
          placeholder="Search by name or email..." 
          class="search-input"
          @input="handleSearch"
        >
        <button 
          v-if="searchQuery" 
          @click="clearSearch" 
          class="clear-search-btn"
        >
          <i class="pi pi-times"></i>
        </button>
      </div>
      
      <!-- Results count -->
      <div v-if="!usersStore.isLoading" class="search-results-info">
        <span>{{ filteredUsers.length }} user{{ filteredUsers.length !== 1 ? 's' : '' }} found</span>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="usersStore.isLoading" class="loading-state">
      <i class="pi pi-spin pi-spinner loading-spinner"></i>
      <p>Loading users...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="usersStore.error" class="error-state">
      <i class="pi pi-exclamation-triangle error-icon"></i>
      <h3>Unable to load users</h3>
      <p>{{ usersStore.error }}</p>
      <button @click="retryFetch" class="retry-button">
        <i class="pi pi-refresh"></i>
        Try Again
      </button>
    </div>

    <!-- Users List -->
    <div v-else class="users-container">
      <!-- Users Grid -->
      <div v-if="filteredUsers.length > 0" class="users-grid">
        <div 
          v-for="user in filteredUsers" 
          :key="user.id" 
          class="user-card"
          @click="selectUser(user)"
        >
          <!-- User Avatar -->
          <div class="user-avatar">
            <i class="pi pi-user"></i>
          </div>
          
          <!-- User Info -->
          <div class="user-info">
            <h3 class="user-name">{{ getFullName(user) }}</h3>
            <p class="user-email">{{ user.email }}</p>
            <p class="user-joined">Joined {{ formatDate(user.createdAt) }}</p>
          </div>
          
          <!-- Action Button -->
          <div class="user-actions">
            <button class="message-btn" @click.stop="startConversation(user)">
              <i class="pi pi-comment"></i>
              Message
            </button>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="empty-state">
        <i class="pi pi-users empty-icon"></i>
        <h3>{{ searchQuery ? 'No users found' : 'No users available' }}</h3>
        <p>
          {{ searchQuery 
            ? 'Try adjusting your search terms' 
            : 'There are no other users on the platform yet' 
          }}
        </p>
        <button v-if="searchQuery" @click="clearSearch" class="clear-search-button">
          Clear Search
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUsersStore } from '@/store/modules/users'
import { useAuthStore } from '@/store/modules/auth'

const router = useRouter()
const usersStore = useUsersStore()
const authStore = useAuthStore()

const searchQuery = ref('')

// Computed
const filteredUsers = computed(() => usersStore.filteredUsers)

// Methods
const handleSearch = () => {
  usersStore.setSearchQuery(searchQuery.value)
}

const clearSearch = () => {
  searchQuery.value = ''
  usersStore.setSearchQuery('')
}

const retryFetch = () => {
  usersStore.clearError()
  fetchUsers()
}

const getFullName = (user) => {
  return `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Unknown User'
}

const formatDate = (dateString) => {
  if (!dateString) return 'Unknown'
  
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short'
  })
}

const selectUser = (user) => {
  console.log('User selected:', user)
  // You can add more functionality here, like showing user details
}

const startConversation = async (user) => {
  try {
    console.log('Starting conversation with:', user)
    
    // You can implement the logic to create/find a conversation here
    // For now, just navigate to a chat page or show a message
    
    // Option 1: Navigate to a new conversation route with user ID
    router.push(`/chat/new?userId=${user.id}`)
    
    // Option 2: You could also create the conversation here and redirect
    // const conversation = await conversationService.createDirectChat(user.id)
    // router.push(`/chat/${conversation.id}`)
    
  } catch (error) {
    console.error('Error starting conversation:', error)
    // You could show an error toast here
  }
}

const fetchUsers = async () => {
  try {
    await usersStore.fetchUsers()
  } catch (error) {
    console.error('Failed to load users:', error)
  }
}

// Lifecycle
onMounted(() => {
  fetchUsers()
})
</script>

<style scoped>
.user-search {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1.5rem;
}

.user-search-header {
  text-align: center;
  margin-bottom: 2rem;
}

.user-search-header h1 {
  margin: 0 0 0.5rem 0;
  color: #111827;
  font-size: 2.5rem;
  font-weight: 700;
}

.subtitle {
  color: #6b7280;
  font-size: 1.1rem;
  margin: 0;
}

.search-section {
  margin-bottom: 2rem;
}

.search-bar {
  position: relative;
  max-width: 500px;
  margin: 0 auto 1rem auto;
}

.search-icon {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #6b7280;
  z-index: 1;
}

.search-input {
  width: 100%;
  padding: 0.875rem 1rem 0.875rem 3rem;
  border: 2px solid #e5e7eb;
  border-radius: 0.75rem;
  font-size: 1rem;
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.search-input:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.clear-search-btn {
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #6b7280;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 50%;
  transition: background-color 0.2s;
}

.clear-search-btn:hover {
  background-color: #f3f4f6;
}

.search-results-info {
  text-align: center;
  color: #6b7280;
  font-size: 0.9rem;
}

.loading-state,
.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 1rem;
  text-align: center;
}

.loading-spinner {
  font-size: 2.5rem;
  color: #3b82f6;
  margin-bottom: 1rem;
}

.error-icon {
  font-size: 2.5rem;
  color: #dc2626;
  margin-bottom: 1rem;
}

.error-state h3 {
  margin: 0 0 0.5rem 0;
  color: #111827;
}

.error-state p {
  color: #6b7280;
  margin: 0 0 1.5rem 0;
}

.retry-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background-color: #3b82f6;
  color: white;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.2s;
}

.retry-button:hover {
  background-color: #2563eb;
}

.users-container {
  min-height: 400px;
}

.users-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.5rem;
}

.user-card {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.user-card:hover {
  border-color: #3b82f6;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
}

.user-avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.5rem;
  margin: 0 auto 1rem auto;
}

.user-info {
  text-align: center;
  margin-bottom: 1rem;
}

.user-name {
  margin: 0 0 0.25rem 0;
  color: #111827;
  font-size: 1.25rem;
  font-weight: 600;
}

.user-email {
  margin: 0 0 0.5rem 0;
  color: #6b7280;
  font-size: 0.9rem;
}

.user-joined {
  margin: 0;
  color: #9ca3af;
  font-size: 0.8rem;
}

.user-actions {
  display: flex;
  justify-content: center;
}

.message-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background-color: #3b82f6;
  color: white;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
  transition: background-color 0.2s;
}

.message-btn:hover {
  background-color: #2563eb;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 1rem;
  text-align: center;
}

.empty-icon {
  font-size: 3rem;
  color: #d1d5db;
  margin-bottom: 1rem;
}

.empty-state h3 {
  margin: 0 0 0.5rem 0;
  color: #111827;
  font-size: 1.5rem;
}

.empty-state p {
  color: #6b7280;
  margin: 0 0 1.5rem 0;
  max-width: 400px;
}

.clear-search-button {
  padding: 0.75rem 1.5rem;
  background-color: #6b7280;
  color: white;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.2s;
}

.clear-search-button:hover {
  background-color: #4b5563;
}

/* Mobile responsiveness */
@media (max-width: 768px) {
  .user-search {
    padding: 1rem;
  }
  
  .user-search-header h1 {
    font-size: 2rem;
  }
  
  .users-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .user-card {
    padding: 1rem;
  }
}
</style>