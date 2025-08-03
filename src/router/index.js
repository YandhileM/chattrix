import { createRouter, createWebHistory } from 'vue-router'
// import ChatView from '@/views/chat/ChatView.vue'
// import ConversationsView from '@/views/chat/ConversationsView.vue'
// import NewConversationView from '@/views/chat/NewConversationView.vue'
// import LoginView from '@/views/auth/LoginView.vue'
// import SignupView from '@/views/auth/SignupView.vue'
// import ForgotPasswordView from '@/views/auth/ForgotPasswordView.vue'
import { useResponsive } from '@/composables/useResponsive'
import { useAuthStore } from '@/store/modules/auth'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/auth/LoginView.vue'),
    meta: {
      requiresGuest: true,
      redirectAfterLogin: true,
    },
  },
  {
    path: '/',
    name: 'Chat',
    component: () => import('@/views/chat/ChatView.vue'),
    meta: {
      requiresAuth: true,
      desktopOnly: true,
    },
  },
  {
    path: '/conversations',
    name: 'Conversations',
    component: () => import('@/views/chat/ConversationsView.vue'),
    meta: {
      // requiresAuth: true,
      // mobileOnly: true,
    },
  },
    {
  path: '/users',
  name: 'Users',
  component: () => import('@/components/chat/UserSearch.vue') 
},
  {
    path: '/chat/:id',
    name: 'Chat',
    component: () => import('@/views/chat/ChatView.vue')
  },
  {
    path: '/conversations',
    name: 'Conversations', 
    component: () => import('@/views/chat/ConversationsView.vue')
  },
  // {
  //   path: '/chat/:id',
  //   name: 'ChatRoom',
  //   component: () => import('@/views/chat/ChatView.vue'),
  //   meta: { requiresAuth: true },
  // },
  // {
  //   path: '/new-conversation',
  //   name: 'NewConversation',
  //   component: NewConversationView,
  //   meta: { requiresAuth: true },
  // },

]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// Enhanced navigation guard for authentication
router.beforeEach(async (to, from, next) => {
  const { isMobile } = useResponsive()
  const authStore = useAuthStore()

  // Initialize auth store if not already done
  if (!authStore.isAuthenticated && localStorage.getItem('auth_token')) {
    authStore.initializeAuth()
  }

  const isAuthenticated = authStore.isAuthenticated
  const intendedRoute = localStorage.getItem('intended_route')

  // Clear intended route when accessing auth pages
  if (to.meta.requiresGuest) {
    localStorage.removeItem('intended_route')
  }

  // Handle post-login redirection
  if (to.meta.redirectAfterLogin && isAuthenticated) {
    next(isMobile.value ? '/conversations' : '/')
    return
  }

  // Redirect authenticated users away from auth pages
  if (to.meta.requiresGuest && isAuthenticated) {
    const redirectPath = isMobile.value ? '/conversations' : '/'
    next(intendedRoute || redirectPath)
    return
  }

  // Redirect unauthenticated users to login
  if (to.meta.requiresAuth && !isAuthenticated) {
    localStorage.setItem('intended_route', to.fullPath)
    next('/login')
    return
  }

  if (to.meta.desktopOnly && isMobile.value) {
    next('/conversations')
    return
  }
  // Handle mobile-only routes
  if (to.meta.mobileOnly && !isMobile.value) {
    next('/')
    return
  }

  next()
})

export default router
