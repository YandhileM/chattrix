<template>
  <div class="forgot-password-view">
    <div class="forgot-password-container">
      <h1>Reset Password</h1>
      <ForgotPasswordForm />
    </div>
  </div>
</template>

<script setup>
import ForgotPasswordForm from '@/components/auth/ForgotPasswordForm.vue'
</script>

<style scoped>
.forgot-password-view {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: var(--surface-ground);
}

.forgot-password-container {
  max-width: 400px;
  width: 100%;
  padding: 2rem;
}
</style>
