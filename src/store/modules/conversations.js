// store/modules/conversations.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { chatService } from '@/services/chatService'

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
    
    currentChatId.value = chatId
    currentChatMessages.value = []
    currentChatDetails.value = null
    
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
    currentChatId.value = null
    currentChatMessages.value = []
    currentChatDetails.value = null
    messagesError.value = null
  }

  const clearError = () => {
    error.value = null
    messagesError.value = null
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
    
    // Actions
    fetchConversations,
    setCurrentChat,
    fetchChatMessages,
    sendMessage,
    createDirectChat,
    clearCurrentChat,
    clearError,
    
    // Getters
    getConversationById,
    filteredConversations,
    currentChat,
    hasMessages
  }
})

export default useConversationsStore