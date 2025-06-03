<template>
  <div class="conversations-view">
    <div class="conversations-header">
      <LogoutButton class="header-logout" />
      <h1>Conversations</h1>
      <Button icon="pi pi-plus" @click="$router.push('/new-conversation')" class="p-button-rounded" />
    </div>
    <ConversationList />
  </div>
</template>

<script setup>
import LogoutButton from '@/components/common/LogoutButton.vue';
import Button from 'primevue/button'
import ConversationList from '@/components/chat/ConversationList.vue'
</script>

<style scoped>
.conversations-view {
  padding: 1rem;
}

.conversations-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}
</style>
