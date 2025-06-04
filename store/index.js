import { createPinia } from 'pinia'

import { createPinia } from 'pinia'
import auth from './modules/auth'
import users from './modules/users'
import conversations from './modules/conversations'

const pinia = createPinia({
  // Add your modules here
  modules: {
    auth,
    users,
    conversations,
  },
})

export default pinia
