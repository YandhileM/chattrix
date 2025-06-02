<template>
  <div class="app-sidebar">
    <div class="sidebar-header">
      <LogoutButton class="header-logout" />
      <h2>Conversations</h2>

      <Button icon="pi pi-plus" @click="$router.push('/new-conversation')" class="p-button-rounded p-button-sm" />
    </div>
    <ConversationList />
  </div>
</template>

<script setup>
import LogoutButton from '../common/LogoutButton.vue'

import Button from 'primevue/button'
import ConversationList from '@/components/chat/ConversationList.vue'
</script>

<style scoped>
.app-sidebar {
  height: 100%;
  background: var(--surface-card);
  border-right: 1px solid var(--surface-border);
  display: flex;
  flex-direction: column;
}

.sidebar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid var(--surface-border);
}
</style>
