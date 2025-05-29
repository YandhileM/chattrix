<template>
  <div class="chat-view">
    <AppSidebar v-if="!isMobile" class="chat-sidebar" />
    <div class="chat-main">
      <ChatArea />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import AppSidebar from '@/components/layout/AppSidebar.vue'
import ChatArea from '@/components/chat/ChatArea.vue'
import { useResponsive } from '@/composables/useResponsive'

const { isMobile } = useResponsive()
</script>

<style scoped>
.chat-view {
  display: flex;
  height: 100vh;
}

.chat-sidebar {
  width: 300px;
  border-right: 1px solid var(--surface-border);
}

.chat-main {
  flex: 1;
  display: flex;
  flex-direction: column;
}
</style>
