import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/register',
      name: 'registration',
      component: () => import('@/features/registration/views/RegistrationView.vue'),
    },
  ],
})

export default router
