import { describe, expect, it } from 'vitest'

import { i18n, SUPPORTED_LOCALES } from '@/i18n'

const ERROR_KEYS = ['validation', 'network', 'forbidden', 'notFound', 'server', 'unknown'] as const

describe('error i18n keys', () => {
  for (const locale of SUPPORTED_LOCALES) {
    for (const key of ERROR_KEYS) {
      it(`${locale} defines errors.${key}`, () => {
        const translated = i18n.global.t(`errors.${key}`, {}, { locale })

        expect(translated).not.toBe(`errors.${key}`)
        expect(translated.trim().length).toBeGreaterThan(0)
      })
    }
  }
})
