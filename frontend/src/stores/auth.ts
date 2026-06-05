import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { toast } from 'vue-sonner'

import { currentUserQueryKey, getCurrentUser } from '@/features/auth/api/getCurrentUser'
import { logoutUser } from '@/features/auth/api/logoutUser'
import type { AuthUser } from '@/features/auth/types'
import { queryClient } from '@/query'
import { AppError, toAppError } from '@/lib/errors'

type AuthStatus = 'idle' | 'loading' | 'authenticated' | 'anonymous' | 'error'

let initialSessionPromise: Promise<AuthUser | null> | null = null

export const useAuthStore = defineStore('auth', () => {
  const user = ref<AuthUser | null>(null)
  const status = ref<AuthStatus>('idle')
  const error = ref<AppError | null>(null)
  const hasResolvedInitialSession = ref(false)

  const isAuthenticated = computed(() => status.value === 'authenticated' && user.value !== null)
  const isLoading = computed(() => status.value === 'loading')

  function setAuthenticated(nextUser: AuthUser) {
    user.value = nextUser
    status.value = 'authenticated'
    error.value = null
    hasResolvedInitialSession.value = true
  }

  function setAnonymous() {
    user.value = null
    status.value = 'anonymous'
    error.value = null
    hasResolvedInitialSession.value = true
  }

  function setLoading() {
    status.value = 'loading'
    error.value = null
  }

  function setError(nextError: AppError) {
    user.value = null
    status.value = 'error'
    error.value = nextError
    hasResolvedInitialSession.value = true
  }

  async function refreshSession(): Promise<AuthUser | null> {
    if (!initialSessionPromise) {
      setLoading()
      initialSessionPromise = queryClient.fetchQuery({
        queryKey: currentUserQueryKey,
        queryFn: getCurrentUser,
        retry: false,
      }).then((currentUser) => {
        setAuthenticated(currentUser)
        return currentUser
      }).catch((sessionError: unknown) => {
        const appError = toAppError(sessionError)

        if (appError.status === 401 || appError.status === 403) {
          setAnonymous()
          return null
        }

        setError(appError)
        toast.error(appError.message)
        return null
      }).finally(() => {
        initialSessionPromise = null
      })
    }

    return initialSessionPromise
  }

  async function logout() {
    try {
      await logoutUser()
    } catch (logoutError) {
      toast.error(toAppError(logoutError).message)
    } finally {
      queryClient.clear()
      setAnonymous()
    }
  }

  return {
    user,
    status,
    error,
    hasResolvedInitialSession,
    isAuthenticated,
    isLoading,
    setAuthenticated,
    setAnonymous,
    setLoading,
    setError,
    refreshSession,
    logout,
  }
})
