import { i18n, SUPPORTED_LOCALES } from '@/i18n'
import type { SupportedLocale } from '@/i18n'

export type FeatureMessages = Record<SupportedLocale, Record<string, unknown>>

export function registerFeatureMessages(namespace: string, messages: FeatureMessages) {
  for (const locale of SUPPORTED_LOCALES) {
    i18n.global.mergeLocaleMessage(locale, {
      features: {
        [namespace]: messages[locale],
      },
    })
  }
}
