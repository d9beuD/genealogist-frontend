import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('@/features/login/views/LoginView.vue'),
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('@/features/registration/views/RegistrationView.vue'),
    },
  ],
})

export default router
