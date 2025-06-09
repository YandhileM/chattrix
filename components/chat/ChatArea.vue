<template>
  <div class="chat-area">

    <!-- Chat header -->
    <div class="chat-header">
      <div class="user-info">
        <button v-if="isMobile" @click="goBackToConversations" class="mobile-back-button">
          <i class="pi pi-arrow-left"></i>
        </button>
        <img :src="currentConversation.avatar" alt="User avatar" class="avatar">
        <div>
          <h3>{{ currentConversation.user }}</h3>
          <p class="status">{{ currentConversation.status }}</p>
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
      <div v-for="(message, index) in currentConversation.messages" :key="index"
        :class="['message', { 'outgoing': message.sender === 'me', 'incoming': message.sender !== 'me' }]">
        <img v-if="message.sender !== 'me'" :src="currentConversation.avatar" alt="User avatar" class="message-avatar">
        <div class="message-content">
          <div class="message-text">{{ message.text }}</div>
          <div class="message-time">{{ message.time }}</div>
        </div>
      </div>
    </div>

    <!-- Message input -->
    <div class="message-input-container">
      <button class="icon-button">
        <i class="pi pi-paperclip"></i>
      </button>
      <input type="text" v-model="newMessage" placeholder="Type a message..." @keyup.enter="sendMessage">
      <button class="send-button" @click="sendMessage">
        <i class="pi pi-send"></i>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useResponsive } from '@/composables/useResponsive'
onMounted(() => {
  // Handle mobile keyboard appearance
  window.addEventListener('resize', handleResize)
  scrollToBottom()
})



function handleResize() {
  // Scroll to bottom when keyboard appears/disappears
  scrollToBottom()
}
const route = useRoute()
const router = useRouter()
const messagesContainer = ref(null)
const newMessage = ref('')
const goBackToConversations = () => {
  router.push('/conversations')
}
// Dummy conversation data
const currentConversation = ref({
  id: route.params.id || '1',
  user: 'John Doe',
  status: 'Online',
  avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
  messages: [
    {
      sender: 'me',
      text: 'Hey there! How are you doing?',
      time: '10:30 AM'
    },
    {
      sender: 'them',
      text: "I'm good, thanks! Just working on that project we discussed.",
      time: '10:32 AM'
    },
    {
      sender: 'me',
      text: 'Great! Any progress on the design?',
      time: '10:33 AM'
    },
    {
      sender: 'them',
      text: 'Yes, I finished the wireframes. Want me to send them over?',
      time: '10:35 AM'
    },
    {
      sender: 'me',
      text: 'That would be perfect!',
      time: '10:36 AM'
    },
    {
      sender: 'them',
      text: 'Just sent them to your email. Let me know what you think!',
      time: '10:40 AM'
    }
  ]
})
const { isMobile } = useResponsive()


// Auto-scroll to bottom when messages change
onMounted(() => {
  scrollToBottom()
})

function scrollToBottom() {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

function sendMessage() {
  if (newMessage.value.trim() === '') return

  currentConversation.value.messages.push({
    sender: 'me',
    text: newMessage.value,
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  })

  newMessage.value = ''

  // Simulate reply after 1 second
  setTimeout(() => {
    currentConversation.value.messages.push({
      sender: 'them',
      text: getRandomReply(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    })
    scrollToBottom()
  }, 1000)

  scrollToBottom()
}

function getRandomReply() {
  const replies = [
    "Sounds good!",
    "I'll get back to you on that.",
    "Let me check and confirm.",
    "Thanks for letting me know!",
    "Can we discuss this tomorrow?",
    "I appreciate your message!",
    "Working on it right now."
  ]
  return replies[Math.floor(Math.random() * replies.length)]
}
</script>

<style scoped>
.chat-area {
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: var(--chat-bg-color);
  border-left: 1px solid var(--border-color);
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

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
}

.status {
  font-size: 0.8rem;
  color: var(--text-muted);
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

.message {
  display: flex;
  gap: 0.75rem;
  max-width: 80%;
}

.message-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
  align-self: flex-end;
}

.message-content {
  display: flex;
  flex-direction: column;
}

.message-text {
  padding: 0.75rem 1rem;
  border-radius: 1rem;
  line-height: 1.4;
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
}

.message-input-container input:focus {
  border-color: var(--primary-color);
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
  transition: background-color 0.2s;
}

.send-button:hover {
  background-color: var(--primary-color-dark);
}
</style>