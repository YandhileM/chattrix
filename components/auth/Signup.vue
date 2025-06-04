<template>
    <div class="auth-container">
        <h1>Create Account</h1>
        <form @submit.prevent="handleSubmit" class="auth-form">
            <div class="auth-form-group">
                <label for="name">Full Name</label>
                <input type="text" id="name" v-model="name" placeholder="Enter your full name" required />
            </div>
            <div class="auth-form-group">
                <label for="email">Email</label>
                <input type="email" id="email" v-model="email" placeholder="Enter your email" required />
            </div>
            <div class="auth-form-group">
                <label for="password">Password</label>
                <input type="password" id="password" v-model="password" placeholder="Create a password" required />
            </div>
            <div class="auth-form-group">
                <label for="confirmPassword">Confirm Password</label>
                <input type="password" id="confirmPassword" v-model="confirmPassword"
                    placeholder="Confirm your password" required />
            </div>
            <button type="submit" class="auth-button">Sign Up</button>
        </form>
        <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
        <p class="text-center">
            Already have an account? <router-link to="/login">Log in</router-link>
        </p>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const name = ref('');
const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const errorMessage = ref('');

const handleSubmit = () => {
    // Reset error message
    errorMessage.value = '';

    // Validation
    if (!name.value || !email.value || !password.value || !confirmPassword.value) {
        errorMessage.value = 'Please fill in all fields';
        return;
    }

    if (password.value !== confirmPassword.value) {
        errorMessage.value = 'Passwords do not match';
        return;
    }

    console.log('Signup attempt with:', {
        name: name.value,
        email: email.value,
        password: password.value
    });

    // Reset form
    name.value = '';
    email.value = '';
    password.value = '';
    confirmPassword.value = '';

    // Redirect to login after successful signup
    router.push('/login');
};
</script>

<style scoped>
/* No need for additional styles - everything comes from main.css */
</style>