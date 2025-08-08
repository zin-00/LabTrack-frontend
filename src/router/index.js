import { createRouter, createWebHistory } from 'vue-router'
import { useStoreToken } from '../composable/useAuth' // adjust path
import Home from '../pages/Home.vue'
import Login from '../pages/auth/Login.vue'
import Register from '../pages/auth/Register.vue'
import Dashboard from '../pages/dashboard/Dashboard.vue'
import Computers from '../pages/computer/Computers.vue'
import Users from '../pages/users/Users.vue'
import Reports from '../pages/reports/Reports.vue'
import ComputerLogs from '../pages/computer/ComputerLogs.vue'
import Laboratory from '../pages/laboratory/Laboratory.vue'


const routes = [
  { path: '/',             name: 'Home',          component: Home },
  { path: '/login',        name: 'login',         component: Login },
  { path: '/register',     name: 'register',      component: Register },
  { path: '/dashboard',    name: 'dashboard',     component: Dashboard,   meta: { requiresAuth: true }},
  { path: '/computers',    name: 'computers',     component: Computers,   meta: { requiresAuth: true }},
  { path: '/laboratory',   name: 'laboratory',    component: Laboratory,       meta: {requiresAuth: true}},
  { path: '/users',        name: 'users',         component: Users,       meta: {requiresAuth: true}},
  { path: '/computer_logs',name: 'computer_logs', component: ComputerLogs,meta: {requiresAuth: true}},
  { path: '/reports',      name: 'reports',       component: Reports,     meta: {requiresAuth: true}},

]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// Route Guard
router.beforeEach((to, from, next) => {
  const tokenStore = useStoreToken()

  if (!tokenStore.token) {
    tokenStore.loadToken()
  }

  const token = tokenStore.token

  if (to.meta.requiresAuth && !token) {
    return next({ name: 'login' })
  }

  if ((to.name === 'login' || to.name === 'register') && token) {
    return next({ name: 'dashboard' })
  }

  next()
})

export default router
