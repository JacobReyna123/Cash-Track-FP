import { createRouter, createWebHistory } from 'vue-router'
import DashboardView from '@/views/DashboardView.vue'
import ProfileSetupView from '@/views/ProfileSetupView.vue'
import SimulatorView from '@/views/SimulatorView.vue'
import RepaymentScheduleView from '@/views/RepaymentScheduleView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'dashboard',
      component: DashboardView
    },
    {
      path: '/profile',
      name: 'profile',
      component: ProfileSetupView
    },
    {
      path: '/simulator',
      name: 'simulator',
      component: SimulatorView
    },
    {
      path: '/schedule',
      name: 'schedule',
      component: RepaymentScheduleView
    }
  ]
})

export default router
