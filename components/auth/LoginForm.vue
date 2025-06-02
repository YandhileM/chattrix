<template>
  <div class="auth-container">
    <h1>Login</h1>
    <form @submit.prevent="handleSubmit" class="auth-form">
      <div class="auth-form-group">
        <label for="email">Email</label>
        <input type="email" id="email" v-model="email" placeholder="Enter your email" required />
      </div>
      <div class="auth-form-group">
        <label for="password">Password</label>
        <input type="password" id="password" v-model="password" placeholder="Enter your password" required />
      </div>
      <button type="submit" class="auth-button">Login</button>
    </form>
    <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
    <p class="text-center">
      Don't have an account? <router-link to="/signup">Sign up</router-link>
    </p>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useResponsive } from '@/composables/useResponsive'

const router = useRouter()
const { isMobile } = useResponsive()
const email = ref('')
const password = ref('')
const errorMessage = ref('')

const handleSubmit = async () => {
  if (!email.value || !password.value) {
    errorMessage.value = 'Please fill in all fields'
    return
  }

  try {
    // Replace with your actual login logic
    const response = await loginUser(email.value, password.value)

    // On successful login:
    localStorage.setItem('auth_token', response.token)

    // Redirect based on device
    const intendedRoute = localStorage.getItem('intended_route')
    if (intendedRoute) {
      router.push(intendedRoute)
    } else {
      // Mobile goes to conversations list, desktop goes to chat view
      router.push(isMobile.value ? '/conversations' : '/')
    }

  } catch (error) {
    errorMessage.value = error.message || 'Login failed'
  }
}
// Mock login function - replace with your actual API call
async function loginUser(email, password) {
  console.log('Login attempt with:', { email, password })
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500))
  return { token: 'mock-auth-token' }
}
</script>

<style scoped></style>