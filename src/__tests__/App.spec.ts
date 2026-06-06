import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import App from '../App.vue'
import { i18n } from '../i18n'
import router from '../router'
import { pinia } from '../stores'
import { useAuthStore } from '../stores/auth'

describe('App', () => {
  it('mounts renders properly', async () => {
    useAuthStore(pinia).setAnonymous()
    router.push('/')
    await router.isReady()

    const wrapper = mount(App, {
      global: {
        plugins: [pinia, i18n, router],
      },
    })

    expect(wrapper.exists()).toBe(true)
  })
})
