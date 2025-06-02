<template>
  <div class="login-view">
    <div class="login-container">
      <!-- <h1>Login</h1> -->
      <LoginForm />
    </div>
  </div>
</template>

<script setup>
import LoginForm from '@/components/auth/LoginForm.vue'
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
