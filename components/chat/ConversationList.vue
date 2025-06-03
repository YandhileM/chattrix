<template>
  <div class="conversation-list">
    <!-- Search bar -->
    <div class="search-bar">
      <i class="pi pi-search"></i>
      <input type="text" v-model="searchQuery" placeholder="Search conversations..." @input="filterConversations">
    </div>

    <!-- Conversation items -->
    <div class="conversations-container">
      <div v-for="conversation in filteredConversations" :key="conversation.id" class="conversation-item"
        :class="{ 'active': activeConversationId === conversation.id }" @click="selectConversation(conversation.id)">
        <img :src="conversation.avatar" alt="User avatar" class="conversation-avatar">
        <div class="conversation-details">
          <div class="conversation-header">
            <h4>{{ conversation.name }}</h4>
            <span class="conversation-time">{{ conversation.lastMessage.time }}</span>
          </div>
          <p class="conversation-preview">
            <span v-if="conversation.lastMessage.sender === 'me'" class="you-indicator">You: </span>
            {{ conversation.lastMessage.text }}
          </p>
          <div class="conversation-meta">
            <span v-if="conversation.unreadCount" class="unread-count">{{ conversation.unreadCount }}</span>
            <i v-if="conversation.isOnline" class="pi pi-circle-fill online-indicator"></i>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty state -->
    <div v-if="filteredConversations.length === 0" class="empty-state">
      <i class="pi pi-inbox"></i>
      <p>No conversations found</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const searchQuery = ref('')
const activeConversationId = ref('1')

// Dummy conversation data
const conversations = ref([
  {
    id: '1',
    name: 'John Doe',
    avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
    lastMessage: {
      sender: 'them',
      text: 'Hey, how about that project deadline?',
      time: '10:30 AM'
    },
    unreadCount: 2,
    isOnline: true
  },
  {
    id: '2',
    name: 'Sarah Smith',
    avatar: 'https://randomuser.me/api/portraits/women/1.jpg',
    lastMessage: {
      sender: 'me',
      text: 'I sent you the files',
      time: 'Yesterday'
    },
    unreadCount: 0,
    isOnline: false
  },
  {
    id: '3',
    name: 'Team Standup',
    avatar: 'https://randomuser.me/api/portraits/lego/1.jpg',
    lastMessage: {
      sender: 'them',
      text: 'Mike: I finished the API integration',
      time: 'Yesterday'
    },
    unreadCount: 5,
    isOnline: true
  },
  {
    id: '4',
    name: 'Alex Johnson',
    avatar: 'https://randomuser.me/api/portraits/men/2.jpg',
    lastMessage: {
      sender: 'them',
      text: 'Let me know when you want to meet',
      time: 'Tuesday'
    },
    unreadCount: 0,
    isOnline: false
  },
  {
    id: '5',
    name: 'Marketing Group',
    avatar: 'https://randomuser.me/api/portraits/lego/2.jpg',
    lastMessage: {
      sender: 'them',
      text: 'New campaign ideas attached',
      time: 'Monday'
    },
    unreadCount: 0,
    isOnline: true
  }
])

const filteredConversations = computed(() => {
  if (!searchQuery.value) return conversations.value
  return conversations.value.filter(conv =>
    conv.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    conv.lastMessage.text.toLowerCase().includes(searchQuery.value.toLowerCase()))
})

function selectConversation(id) {
  activeConversationId.value = id
  // For mobile view, navigate to the chat view
  if (window.innerWidth < 768) {
    router.push(`/chat/${id}`)
  }
  // For desktop, you would emit an event or use a store
}
</script>

<style scoped>
.conversation-list {
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: white;
  border-right: 1px solid var(--border-color);
}

.search-bar {
  position: relative;
  padding: 1rem;
  border-bottom: 1px solid var(--border-color);
}

.search-bar i {
  position: absolute;
  left: 1.5rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-muted);
}

.search-bar input {
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.5rem;
  border: 1px solid var(--border-color);
  border-radius: 2rem;
  outline: none;
  font-size: 0.9rem;
}

.search-bar input:focus {
  border-color: var(--primary-color);
}

.conversations-container {
  flex: 1;
  overflow-y: auto;
}

.conversation-item {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;
  border-bottom: 1px solid var(--border-light);
}

.conversation-item:hover {
  background-color: var(--hover-bg);
}

.conversation-item.active {
  background-color: var(--active-bg);
}

.conversation-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
}

.conversation-details {
  flex: 1;
  min-width: 0;
}

.conversation-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.25rem;
}

.conversation-header h4 {
  margin: 0;
  font-size: 1rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.conversation-time {
  font-size: 0.75rem;
  color: var(--text-muted);
}

.conversation-preview {
  margin: 0;
  font-size: 0.9rem;
  color: var(--text-muted);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.you-indicator {
  color: var(--primary-color);
  font-weight: 500;
}

.conversation-meta {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.25rem;
}

.unread-count {
  background-color: var(--primary-color);
  color: white;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.7rem;
  font-weight: bold;
}

.online-indicator {
  color: var(--online-color);
  font-size: 0.6rem;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 2rem;
  color: var(--text-muted);
  text-align: center;
}

.empty-state i {
  font-size: 2rem;
  margin-bottom: 1rem;
}

.empty-state p {
  margin: 0;
}
</style>