import { createRouter, createWebHistory } from 'vue-router'
import ChatView from '@/views/chat/ChatView.vue'
import ConversationsView from '@/views/chat/ConversationsView.vue'
import NewConversationView from '@/views/chat/NewConversationView.vue'
import LoginView from '@/views/auth/LoginView.vue'
import ForgotPasswordView from '@/views/auth/ForgotPasswordView.vue'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: LoginView
  },
  {
    path: '/forgot-password',
    name: 'ForgotPassword',
    component: ForgotPasswordView
  },
  {
    path: '/',
    name: 'Chat',
    component: ChatView,
    meta: { requiresAuth: true }
  },
  {
    path: '/conversations',
    name: 'Conversations',
    component: ConversationsView,
    meta: { requiresAuth: true, mobileOnly: true }
  },
  {
    path: '/chat/:id',
    name: 'ChatRoom',
    component: ChatView,
    meta: { requiresAuth: true }
  },
  {
    path: '/new-conversation',
    name: 'NewConversation',
    component: NewConversationView,
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Navigation guard for authentication
router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('auth_token')
  
  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login')
  } else if (to.name === 'Login' && isAuthenticated) {
    next('/')
  } else {
    next()
  }
})

export default router
