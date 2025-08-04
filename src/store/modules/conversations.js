// store/modules/conversations.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { chatService } from '@/services/chatService'
import { signalRService } from '@/services/signalRService'
import { useAuthStore } from '@/store/modules/auth'

export const useConversationsStore = defineStore('conversations', () => {
  // State
  const conversations = ref([])
  const currentChatId = ref(null)
  const currentChatMessages = ref([])
  const currentChatDetails = ref(null)
  const isLoading = ref(false)
  const isLoadingMessages = ref(false)
  const error = ref(null)
  const messagesError = ref(null)
  
  // SignalR related state
  const isSignalRConnected = ref(false)

  // SignalR initialization
  const initializeSignalR = async () => {
    const authStore = useAuthStore()
    const token = authStore.token
    
    if (!token) {
      console.warn('No auth token available for SignalR connection')
      return
    }

    try {
      await signalRService.connect(token)
      isSignalRConnected.value = true
      setupSignalRListeners()
      console.log('SignalR initialized successfully')
    } catch (error) {
      console.error('Failed to initialize SignalR:', error)
      isSignalRConnected.value = false
    }
  }
  const clearError = () => {
    error.value = null
    messagesError.value = null
  }

  const setupSignalRListeners = () => {
    // Listen for incoming messages from your C# hub
    signalRService.onMessageReceived((message) => {
      console.log('New message received via SignalR:', message)
      
      // Add message to current chat if it belongs to the active chat
      if (currentChatId.value === message.chatId) {
        // Check if message already exists (prevent duplicates)
        const existingMessage = currentChatMessages.value.find(m => m.id === message.id)
        if (!existingMessage) {
          currentChatMessages.value.push(message)
        }
      }
      
      // Update the conversation's last message
      const conversationIndex = conversations.value.findIndex(conv => conv.id === message.chatId)
      if (conversationIndex !== -1) {
        conversations.value[conversationIndex].lastMessage = message
        // Move conversation to top of list
        const conversation = conversations.value.splice(conversationIndex, 1)[0]
        conversations.value.unshift(conversation)
      }
    })
  }

  // Actions
  const fetchConversations = async () => {
    isLoading.value = true
    error.value = null
    
    try {
      const response = await chatService.getConversations()
      conversations.value = response
      console.log('Conversations fetched:', response)
    } catch (err) {
      error.value = err.message || 'Failed to fetch conversations'
      console.error('Error fetching conversations:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const setCurrentChat = async (chatId) => {
    if (currentChatId.value === chatId) return
    
    // Leave previous chat group
    if (currentChatId.value && isSignalRConnected.value) {
      await signalRService.leaveChatGroup(currentChatId.value)
    }
    
    currentChatId.value = chatId
    currentChatMessages.value = []
    currentChatDetails.value = null
    
    // Join new chat group
    if (chatId && isSignalRConnected.value) {
      await signalRService.joinChatGroup(chatId)
    }
    
    await fetchChatMessages(chatId)
  }

  const fetchChatMessages = async (chatId) => {
    if (!chatId) return
    
    isLoadingMessages.value = true
    messagesError.value = null
    
    try {
      const messages = await chatService.getChatMessages(chatId)
      currentChatMessages.value = messages
      
      // Also get the chat details from the conversations list
      const chatDetails = conversations.value.find(conv => conv.id === parseInt(chatId))
      if (chatDetails) {
        currentChatDetails.value = chatDetails
      }
      
      console.log('Chat messages fetched:', messages)
    } catch (err) {
      messagesError.value = err.message || 'Failed to fetch messages'
      console.error('Error fetching chat messages:', err)
      throw err
    } finally {
      isLoadingMessages.value = false
    }
  }

  // Keep your existing sendMessage implementation unchanged
  const sendMessage = async (messageText) => {
    if (!currentChatId.value || !messageText.trim()) return
    
    try {
      const newMessage = await chatService.sendMessage(currentChatId.value, messageText.trim())
      
      // Add the new message to the current messages
      currentChatMessages.value.push(newMessage)
      
      // Update the last message in the conversations list
      const conversationIndex = conversations.value.findIndex(conv => conv.id === currentChatId.value)
      if (conversationIndex !== -1) {
        conversations.value[conversationIndex].lastMessage = newMessage
      }
      
      console.log('Message sent:', newMessage)
      return newMessage
    } catch (err) {
      console.error('Error sending message:', err)
      throw err
    }
  }

  const createDirectChat = async (user) => {
    try {
      // Check if a direct chat already exists with this user
      const existingChat = conversations.value.find(conv => 
        conv.isDirectChat && 
        conv.participants && 
        conv.participants.some(participant => participant.id === user.id)
      )
      
      if (existingChat) {
        console.log('Direct chat already exists:', existingChat)
        return existingChat
      }
      
      // Create a new direct chat
      const title = `Chat with ${user.firstName} ${user.lastName}`.trim()
      const newConversation = await chatService.createConversation(
        title,
        'Descr', // Empty description for direct chats
        true, // isDirectChat
        [user.id] // userIds array with the selected user
      )
      
      // Add the new conversation to the list
      conversations.value.unshift(newConversation)
      
      console.log('New direct chat created:', newConversation)
      return newConversation
    } catch (err) {
      console.error('Error creating direct chat:', err)
      throw err
    }
  }

  const clearCurrentChat = () => {
    if (currentChatId.value && isSignalRConnected.value) {
      signalRService.leaveChatGroup(currentChatId.value)
    }
    
    currentChatId.value = null
    currentChatMessages.value = []
    currentChatDetails.value = null
    messagesError.value = null
  }

  const disconnectSignalR = async () => {
    await signalRService.disconnect()
    isSignalRConnected.value = false
  }

  // Getters
  const getConversationById = (id) => {
    return conversations.value.find(conv => conv.id === id)
  }

  const filteredConversations = (searchQuery) => {
    if (!searchQuery) return conversations.value
    
    return conversations.value.filter(conv =>
      conv.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.lastMessage?.text?.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }

  const currentChat = computed(() => {
    if (!currentChatId.value) return null
    return conversations.value.find(conv => conv.id === currentChatId.value) || currentChatDetails.value
  })

  const hasMessages = computed(() => currentChatMessages.value.length > 0)

  return {
    // State
    conversations,
    currentChatId,
    currentChatMessages,
    currentChatDetails,
    isLoading,
    isLoadingMessages,
    error,
    messagesError,
    isSignalRConnected,
    
    // Actions
    fetchConversations,
    setCurrentChat,
    fetchChatMessages,
    sendMessage, // Keep your existing implementation
    createDirectChat,
    clearCurrentChat,
    clearError,
    
    // SignalR Actions
    initializeSignalR,
    disconnectSignalR,
    
    // Getters
    getConversationById,
    filteredConversations,
    currentChat,
    hasMessages
  }
})

export default useConversationsStore