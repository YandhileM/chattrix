<template>
    <div class="auth-container">
        <h1>Create Account</h1>
        <form @submit.prevent="handleSubmit" class="auth-form">
            <div class="auth-form-group">
                <label for="firstName">First Name</label>
                <input 
                    type="text" 
                    id="firstName" 
                    v-model="firstName" 
                    placeholder="Enter your first name" 
                    required 
                    :disabled="isLoading"
                />
            </div>
            <div class="auth-form-group">
                <label for="lastName">Last Name</label>
                <input 
                    type="text" 
                    id="lastName" 
                    v-model="lastName" 
                    placeholder="Enter your last name" 
                    required 
                    :disabled="isLoading"
                />
            </div>
            <div class="auth-form-group">
                <label for="email">Email</label>
                <input 
                    type="email" 
                    id="email" 
                    v-model="email" 
                    placeholder="Enter your email" 
                    required 
                    :disabled="isLoading"
                />
            </div>
            <div class="auth-form-group">
                <label for="password">Password</label>
                <input 
                    type="password" 
                    id="password" 
                    v-model="password" 
                    placeholder="Create a password" 
                    required 
                    :disabled="isLoading"
                />
            </div>
            <div class="auth-form-group">
                <label for="confirmPassword">Confirm Password</label>
                <input 
                    type="password" 
                    id="confirmPassword" 
                    v-model="confirmPassword"
                    placeholder="Confirm your password" 
                    required 
                    :disabled="isLoading"
                />
            </div>
            <button type="submit" class="auth-button" :disabled="isLoading">
                {{ isLoading ? 'Creating Account...' : 'Sign Up' }}
            </button>
        </form>

        <div v-if="errorMessage" class="error-message">
            <p>{{ errorMessage }}</p>
            <button @click="clearError" class="clear-error-btn">×</button>
        </div>

        <div v-if="successMessage" class="success-message">
            <p>{{ successMessage }}</p>
        </div>

        <p class="text-center">
            Already have an account? <router-link to="/login">Log in</router-link>
        </p>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { authService } from '@/services/authService'

const router = useRouter()

// Form state
const firstName = ref('')
const lastName = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const errorMessage = ref('')
const successMessage = ref('')
const isLoading = ref(false)

// Clear error message
const clearError = () => {
    errorMessage.value = ''
}

const clearMessages = () => {
    errorMessage.value = ''
    successMessage.value = ''
}

const resetForm = () => {
    firstName.value = ''
    lastName.value = ''
    email.value = ''
    password.value = ''
    confirmPassword.value = ''
}

const handleSubmit = async () => {
    // Clear previous messages
    clearMessages()

    // Client-side validation
    if (!firstName.value || !lastName.value || !email.value || !password.value || !confirmPassword.value) {
        errorMessage.value = 'Please fill in all fields'
        return
    }

    if (password.value !== confirmPassword.value) {
        errorMessage.value = 'Passwords do not match'
        return
    }

    if (password.value.length < 6) {
        errorMessage.value = 'Password must be at least 6 characters long'
        return
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email.value)) {
        errorMessage.value = 'Please enter a valid email address'
        return
    }

    isLoading.value = true

    try {
        // Prepare user data for API
        const userData = {
            firstName: firstName.value,
            lastName: lastName.value,
            email: email.value,
            password: password.value
        }

        console.log('Registration attempt with:', userData)

        // Call the auth service
        const response = await authService.register(userData)
        
        console.log('Registration successful:', response)
        
        // Show success message
        successMessage.value = 'Account created successfully! Please log in.'
        
        // Reset form
        resetForm()
        
        // Redirect to login page after a short delay
        setTimeout(() => {
            router.push('/login')
        }, 2000)

    } catch (error) {
        console.error('Registration failed:', error)
        
        // Handle different types of errors
        if (error.response?.status === 409) {
            errorMessage.value = 'An account with this email already exists'
        } else if (error.response?.status === 400) {
            errorMessage.value = error.response.data?.message || 'Invalid registration data'
        } else if (error.response?.data?.message) {
            errorMessage.value = error.response.data.message
        } else {
            errorMessage.value = 'Registration failed. Please try again.'
        }
    } finally {
        isLoading.value = false
    }
}
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

.success-message {
    background-color: #f0fdf4;
    border: 1px solid #bbf7d0;
    color: #166534;
    padding: 0.75rem;
    border-radius: 0.5rem;
    margin-top: 1rem;
    text-align: center;
}

.success-message p {
    margin: 0;
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