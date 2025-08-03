<template>
    <div class="login-view">
        <div class="login-container">
            <!-- <h1>Login</h1> -->
            <SignupForm />
        </div>
    </div>
</template>

<script setup>
import SignupForm from '@/components/auth/Signup.vue';
</script>

<style scoped>
.login-view {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background-color: var(--surface-ground);
}

.login-container {
    max-width: 400px;
    width: 100%;
    padding: 2rem;
}
</style>
