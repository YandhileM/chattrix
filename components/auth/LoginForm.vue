<template>
  <div class="auth-container">
    <h1>Login</h1>
    <form @submit.prevent="handleSubmit" class="auth-form">
      <div class="auth-form-group">
        <label for="email">Email</label>
        <input type="email" id="email" v-model="email" placeholder="Enter your email" required :disabled="isLoading" />
      </div>
      <div class="auth-form-group">
        <label for="password">Password</label>
        <input type="password" id="password" v-model="password" placeholder="Enter your password" required
          :disabled="isLoading" />
      </div>
      <button type="submit" class="auth-button" :disabled="isLoading">
        {{ isLoading ? 'Logging in...' : 'Login' }}
      </button>
    </form>

    <div v-if="errorMessage" class="error-message">
      <p>{{ errorMessage }}</p>
      <button @click="clearError" class="clear-error-btn">×</button>
    </div>

    <p class="text-center">
      Don't have an account? <router-link to="/signup">Sign up</router-link>
    </p>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useResponsive } from '@/composables/useResponsive'
import { useAuthStore } from '@/store/modules/auth'

const router = useRouter()
const authStore = useAuthStore()
const { isMobile } = useResponsive()

// Form state
const email = ref('')
const password = ref('')
const errorMessage = ref('')
const isLoading = ref(false)

// Clear error message
const clearError = () => {
  errorMessage.value = ''
}

// Form validation
const validateForm = () => {
  if (!email.value || !password.value) {
    errorMessage.value = 'Please fill in all fields'
    return false
  }

  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email.value)) {
    errorMessage.value = 'Please enter a valid email address'
    return false
  }

  if (password.value.length < 6) {
    errorMessage.value = 'Password must be at least 6 characters long'
    return false
  }

  return true
}

const handleSubmit = async () => {
  // Clear previous errors
  clearError()

  // Validate form
  if (!validateForm()) {
    return
  }

  isLoading.value = true

  try {
    // Create user data object
    const userData = {
      email: email.value,
      password: password.value,
    }

    // Call the store's login action
    const response = await authStore.login(userData, null)

    // Store token in localStorage if provided
    if (response.token) {
      localStorage.setItem('auth_token', response.token)
    }

    // Success - redirect user
    const intendedRoute = localStorage.getItem('intended_route')
    if (intendedRoute) {
      localStorage.removeItem('intended_route') // Clean up
      router.push(intendedRoute)
    } else {
      // Mobile goes to conversations list, desktop goes to chat view
      router.push(isMobile.value ? '/conversations' : '/')
    }
  } catch (error) {
    console.error('Login error:', error)

    // Handle different types of errors
    if (error.name === 'NetworkError' || error.message.includes('fetch')) {
      errorMessage.value = 'Network error. Please check your connection and try again.'
    } else if (error.message.includes('401') || error.message.includes('Unauthorized')) {
      errorMessage.value = 'Invalid email or password. Please try again.'
    } else if (error.message.includes('429') || error.message.includes('Too Many Requests')) {
      errorMessage.value = 'Too many login attempts. Please wait a moment and try again.'
    } else if (error.message.includes('500') || error.message.includes('Server Error')) {
      errorMessage.value = 'Server error. Please try again later.'
    } else if (error.message.includes('timeout')) {
      errorMessage.value = 'Request timed out. Please try again.'
    } else {
      // Generic error message
      errorMessage.value = error.message || 'Login failed. Please try again.'
    }
  } finally {
    isLoading.value = false
  }
}

// Optional: Clear form on component unmount
import { onUnmounted } from 'vue'
onUnmounted(() => {
  email.value = ''
  password.value = ''
  errorMessage.value = ''
})
</script>

<style scoped>
.auth-container {
  max-width: 400px;
  margin: 0 auto;
  padding: 2rem;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.auth-form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.auth-form-group label {
  font-weight: 600;
  color: #374151;
}

.auth-form-group input {
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 1rem;
  transition:
    border-color 0.2s,
    box-shadow 0.2s;
}

.auth-form-group input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.auth-form-group input:disabled {
  background-color: #f9fafb;
  cursor: not-allowed;
  opacity: 0.6;
}

.auth-button {
  padding: 0.75rem 1.5rem;
  background-color: #3b82f6;
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition:
    background-color 0.2s,
    opacity 0.2s;
}

.auth-button:hover:not(:disabled) {
  background-color: #2563eb;
}

.auth-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.error-message {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #fef2f2;
  border: 1px solid #fecaca;
  color: #dc2626;
  padding: 0.75rem;
  border-radius: 0.5rem;
  margin-top: 1rem;
}

.error-message p {
  margin: 0;
  flex: 1;
}

.clear-error-btn {
  background: none;
  border: none;
  color: #dc2626;
  font-size: 1.25rem;
  cursor: pointer;
  padding: 0;
  margin-left: 0.5rem;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: background-color 0.2s;
}

.clear-error-btn:hover {
  background-color: rgba(220, 38, 38, 0.1);
}

.text-center {
  text-align: center;
  margin-top: 1rem;
  color: #6b7280;
}

.text-center a {
  color: #3b82f6;
  text-decoration: none;
  font-weight: 500;
}

.text-center a:hover {
  text-decoration: underline;
}

h1 {
  text-align: center;
  margin-bottom: 2rem;
  color: #111827;
  font-size: 2rem;
  font-weight: 700;
}
</style>
