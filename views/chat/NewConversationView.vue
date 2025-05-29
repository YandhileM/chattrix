<template>
  <div class="new-conversation-view">
    <div class="new-conversation-header">
      <Button 
        icon="pi pi-arrow-left" 
        @click="$router.back()"
        class="p-button-text"
      />
      <h1>New Conversation</h1>
    </div>
    <UserSearch />
  </div>
</template>

<script setup>
import Button from 'primevue/button'
import UserSearch from '@/components/chat/UserSearch.vue'
</script>

<style scoped>
.new-conversation-view {
  padding: 1rem;
}

.new-conversation-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}
</style>
