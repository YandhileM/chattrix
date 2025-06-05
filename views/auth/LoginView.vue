<template>
  <div class="login-view">
    <div class="login-container">
      <!-- Tab Headers -->
      <div class="tab-header">
        <button :class="['tab-button', { active: activeTab === 'signin' }]" @click="activeTab = 'signin'">
          Sign In
        </button>
        <button :class="['tab-button', { active: activeTab === 'signup' }]" @click="activeTab = 'signup'">
          Sign Up
        </button>
      </div>

      <!-- Tab Content -->
      <div class="tab-content">
        <div v-if="activeTab === 'signin'" class="tab-pane">
          <LoginForm />
        </div>
        <div v-if="activeTab === 'signup'" class="tab-pane">
          <SignupForm />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import LoginForm from '@/components/auth/LoginForm.vue'
import SignupForm from '@/components/auth/Signup.vue'

const activeTab = ref('signin') // Default to sign in tab
</script>

<style scoped>
.login-view {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  min-height: 100vh;
  background-color: var(--surface-ground);
  padding: 2rem 0;
  overflow-y: auto;
}

.login-container {
  max-width: 400px;
  width: 100%;
  padding: 2rem;
}

.tab-header {
  display: flex;
  border-bottom: 2px solid var(--surface-border, #e5e7eb);
  margin-bottom: 2rem;
}

.tab-button {
  flex: 1;
  padding: 1rem;
  border: none;
  background: none;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 500;
  color: var(--text-color-secondary, #6b7280);
  border-bottom: 2px solid transparent;
  transition: all 0.2s ease;
}

.tab-button:hover {
  color: var(--primary-color, #3b82f6);
  background-color: var(--surface-hover, #f9fafb);
}

.tab-button.active {
  color: var(--primary-color, #3b82f6);
  border-bottom-color: var(--primary-color, #3b82f6);
}

.tab-content {
  /* Prevents layout shift when switching tabs */
  overflow-y: auto;
  max-height: calc(100vh - 200px);
}

.tab-pane {
  animation: fadeIn 0.2s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>