<!-- components/common/LogoutButton.vue -->
<template>
    <button @click="handleLogout" class="logout-button">
        <i class="pi pi-sign-out"></i>
        <!-- <span>Logout</span> -->
    </button>
</template>

<script setup>
import { useRouter } from 'vue-router'


const router = useRouter()

const handleLogout = async () => {
    try {
        // Add your logout logic here (API call, etc.)
        // Example:
        // await authService.logout()

        // Clear local storage
        localStorage.removeItem('auth_token')
        localStorage.removeItem('user')

        // If using Vuex:
        // store.commit('auth/clearUser')

        // Redirect to login
        router.push('/login')
    } catch (error) {
        console.error('Logout failed:', error)
    }
}
</script>

<style scoped>
.logout-button {
    display: flex;
    align-items: center;
    /* gap: 0.5rem;
    padding: 0.5rem 1rem; */
    background-color: var(--danger-color);
    color: black;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.2s;
}

.logout-button:hover {
    background-color: var(--danger-color-dark);
}

/* Add to your variables.css */
:root {
    --danger-color: #f44336;
    --danger-color-dark: #d32f2f;
}
</style>