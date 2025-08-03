// services/chatService.js
import api from './api.js'

export const chatService = {
  // Fetch all conversations
  async getConversations() {
    try {
      const response = await api.get('/chats')
      return response.data
    } catch (error) {
      console.error('Error fetching conversations:', error)
      throw error
    }
  },

  // Fetch messages for a specific chat
  async getChatMessages(chatId) {
    try {
      const response = await api.get(`/chats/${chatId}/messages`)
      return response.data
    } catch (error) {
      console.error('Error fetching chat messages:', error)
      throw error
    }
  },

  // Send a message to a chat
  async sendMessage(chatId, messageText) {
    try {
      const response = await api.post(`/chats/${chatId}/messages`, {
        text: messageText
      })
      return response.data
    } catch (error) {
      console.error('Error sending message:', error)
      throw error
    }
  },

  // Get chat details by ID
  async getChatById(chatId) {
    try {
      const response = await api.get(`/chats/${chatId}`)
      return response.data
    } catch (error) {
      console.error('Error fetching chat details:', error)
      throw error
    }
  }
}

export default chatService