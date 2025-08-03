<template>
  <div class="chat-area">
    <!-- Loading state for chat -->
    <div v-if="conversationsStore.isLoadingMessages" class="loading-container">
      <i class="pi pi-spin pi-spinner loading-spinner"></i>
      <p>Loading messages...</p>
    </div>

    <!-- Error state -->
    <div v-else-if="conversationsStore.messagesError" class="error-container">
      <i class="pi pi-exclamation-triangle error-icon"></i>
      <h3>Unable to load messages</h3>
      <p>{{ conversationsStore.messagesError }}</p>
      <button @click="retryLoadMessages" class="retry-button">
        <i class="pi pi-refresh"></i>
        Try Again
      </button>
    </div>

    <!-- No chat selected state -->
    <div v-else-if="!conversationsStore.currentChat" class="no-chat-container">
      <i class="pi pi-comments no-chat-icon"></i>
      <h3>Select a conversation</h3>
      <p>Choose a conversation from the list to start messaging</p>
    </div>

    <!-- Chat interface -->
    <div v-else class="chat-content">
      <!-- Chat header -->
      <div class="chat-header">
        <div class="user-info">
          <button v-if="isMobile" @click="goBackToConversations" class="mobile-back-button">
            <i class="pi pi-arrow-left"></i>
          </button>
          
          <!-- Avatar placeholder -->
          <div class="avatar">
            <i class="pi pi-user"></i>
          </div>
          
          <div>
            <h3>{{ getChatTitle() }}</h3>
            <p class="status">{{ getChatStatus() }}</p>
          </div>
        </div>
        
        <div class="chat-actions">
          <button class="icon-button">
            <i class="pi pi-phone"></i>
          </button>
          <button class="icon-button">
            <i class="pi pi-video"></i>
          </button>
          <button class="icon-button">
            <i class="pi pi-ellipsis-v"></i>
          </button>
        </div>
      </div>

      <!-- Messages container -->
      <div class="messages-container" ref="messagesContainer">
        <div v-if="conversationsStore.currentChatMessages.length === 0" class="no-messages">
          <i class="pi pi-comment"></i>
          <p>No messages yet. Start the conversation!</p>
        </div>
        
        <div 
          v-for="message in conversationsStore.currentChatMessages" 
          :key="message.id"
          :class="['message', { 
            'outgoing': isMyMessage(message), 
            'incoming': !isMyMessage(message) 
          }]"
        >
          <div v-if="!isMyMessage(message)" class="message-avatar">
            <i class="pi pi-user"></i>
          </div>
          
          <div class="message-content">
            <div class="message-text">{{ message.text }}</div>
            <div class="message-time">{{ formatMessageTime(message.createdAt) }}</div>
          </div>
        </div>
      </div>

      <!-- Message input -->
      <div class="message-input-container">
        <button class="icon-button">
          <i class="pi pi-paperclip"></i>
        </button>
        <input 
          type="text" 
          v-model="newMessage" 
          placeholder="Type a message..." 
          @keyup.enter="sendMessage"
          :disabled="isSending"
        >
        <button 
          class="send-button" 
          @click="sendMessage"
          :disabled="!newMessage.trim() || isSending"
        >
          <i class="pi pi-spin pi-spinner" v-if="isSending"></i>
          <i class="pi pi-send" v-else></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick, watch, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useResponsive } from '@/composables/useResponsive'
import { useConversationsStore } from '@/store/modules/conversations'
import { useAuthStore } from '@/store/modules/auth'

const route = useRoute()
const router = useRouter()
const messagesContainer = ref(null)
const newMessage = ref('')
const isSending = ref(false)

const conversationsStore = useConversationsStore()
const authStore = useAuthStore()
const { isMobile } = useResponsive()

// Computed properties
const currentUserId = computed(() => authStore.authData?.id)

// Methods
const goBackToConversations = () => {
  router.push('/conversations')
}

const isMyMessage = (message) => {
  return message.sender?.id === currentUserId.value || message.senderId === currentUserId.value
}

const getChatTitle = () => {
  const chat = conversationsStore.currentChat
  if (!chat) return ''
  
  if (chat.isDirectChat) {
    // For direct chats, we might want to show the other user's name
    // This would require additional logic to determine the other participant
    return chat.title || 'Direct Chat'
  }
  
  return chat.title || 'Group Chat'
}

const getChatStatus = () => {
  const chat = conversationsStore.currentChat
  if (!chat) return ''
  
  if (chat.isDirectChat) {
    return 'Online' // You could implement real online status here
  }
  
  return `${chat.description || 'Group conversation'}`
}

const formatMessageTime = (dateString) => {
  if (!dateString) return ''
  
  const date = new Date(dateString)
  const now = new Date()
  const diffTime = Math.abs(now - date)
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  if (diffDays === 1) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  } else if (diffDays === 2) {
    return 'Yesterday'
  } else if (diffDays <= 7) {
    return date.toLocaleDateString([], { weekday: 'short' })
  } else {
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' })
  }
}

const scrollToBottom = async () => {
  await nextTick()
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

const sendMessage = async () => {
  if (!newMessage.value.trim() || isSending.value) return

  const messageText = newMessage.value.trim()
  newMessage.value = ''
  isSending.value = true

  try {
    await conversationsStore.sendMessage(messageText)
    await scrollToBottom()
  } catch (error) {
    console.error('Failed to send message:', error)
    // You could show an error toast here
    newMessage.value = messageText // Restore the message on error
  } finally {
    isSending.value = false
  }
}

const retryLoadMessages = () => {
  if (conversationsStore.currentChatId) {
    conversationsStore.fetchChatMessages(conversationsStore.currentChatId)
  }
}

const handleResize = () => {
  scrollToBottom()
}

// Watchers
watch(() => conversationsStore.currentChatMessages, () => {
  scrollToBottom()
}, { deep: true })

watch(() => route.params.id, (newChatId) => {
  if (newChatId) {
    conversationsStore.setCurrentChat(parseInt(newChatId))
  }
}, { immediate: true })

// Lifecycle
onMounted(() => {
  window.addEventListener('resize', handleResize)
  scrollToBottom()
})
</script>

<style scoped>
.chat-area {
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: var(--chat-bg-color);
  border-left: 1px solid var(--border-color);
}

.loading-container,
.error-container,
.no-chat-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 2rem;
  text-align: center;
  color: var(--text-muted);
}

.loading-spinner {
  font-size: 2.5rem;
  color: var(--primary-color);
  margin-bottom: 1rem;
}

.error-icon {
  font-size: 2.5rem;
  color: #dc2626;
  margin-bottom: 1rem;
}

.no-chat-icon {
  font-size: 3rem;
  color: var(--border-color);
  margin-bottom: 1rem;
}

.retry-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  font-weight: 500;
  margin-top: 1rem;
  transition: background-color 0.2s;
}

.retry-button:hover {
  opacity: 0.9;
}

.chat-content {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.chat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid var(--border-color);
  background-color: white;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.mobile-back-button {
  display: none;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  background: none;
  border: none;
  color: var(--primary-color);
  cursor: pointer;
  border-radius: 50%;
  transition: background-color 0.2s;
}

.mobile-back-button:hover {
  background-color: var(--hover-bg);
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--primary-color), #1d4ed8);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1rem;
}

.status {
  font-size: 0.8rem;
  color: var(--text-muted);
  margin: 0;
}

.chat-actions {
  display: flex;
  gap: 0.5rem;
}

.icon-button {
  background: none;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
  transition: background-color 0.2s;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-button:hover {
  background-color: var(--hover-bg);
}

.messages-container {
  flex: 1;
  padding: 1rem;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.no-messages {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: var(--text-muted);
  text-align: center;
}

.no-messages i {
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.message {
  display: flex;
  gap: 0.75rem;
  max-width: 80%;
}

.message-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: linear-gradient(135deg, #6b7280, #4b5563);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 0.875rem;
  align-self: flex-end;
  flex-shrink: 0;
}

.message-content {
  display: flex;
  flex-direction: column;
}

.message-text {
  padding: 0.75rem 1rem;
  border-radius: 1rem;
  line-height: 1.4;
  word-wrap: break-word;
}

.message-time {
  font-size: 0.75rem;
  color: var(--text-muted);
  margin-top: 0.25rem;
  align-self: flex-end;
}

.incoming .message-text {
  background-color: white;
  border-top-left-radius: 0;
  color: #111827;
}

.outgoing {
  align-self: flex-end;
}

.outgoing .message-text {
  background-color: var(--primary-color);
  color: white;
  border-top-right-radius: 0;
}

.outgoing .message-time {
  align-self: flex-end;
}

.message-input-container {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem;
  background-color: white;
  border-top: 1px solid var(--border-color);
}

.message-input-container input {
  flex: 1;
  padding: 0.75rem 1rem;
  border: 1px solid var(--border-color);
  border-radius: 2rem;
  outline: none;
  transition: border-color 0.2s;
}

.message-input-container input:focus {
  border-color: var(--primary-color);
}

.message-input-container input:disabled {
  background-color: #f9fafb;
  cursor: not-allowed;
  opacity: 0.6;
}

.send-button {
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
}

.send-button:hover:not(:disabled) {
  background-color: var(--primary-color-dark);
}

.send-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Mobile styles */
@media (max-width: 768px) {
  .mobile-back-button {
    display: flex;
  }
}
</style>