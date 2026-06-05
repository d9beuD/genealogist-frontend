import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/auth',
      name: 'auth',
      component: () => import('@/features/auth/views/AuthView.vue'),
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('@/features/registration/views/RegistrationView.vue'),
    },
  ],
})

export default router
