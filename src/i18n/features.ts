import { i18n } from '@/i18n'

type FeatureMessages = Record<'en' | 'fr', Record<string, unknown>>

export function registerFeatureMessages(namespace: string, messages: FeatureMessages) {
  const nested: Record<string, unknown> = {}

  for (const loc of ['en', 'fr'] as const) {
    const dict = messages[loc]
    if (dict) {
      nested[loc] = dict
    }
  }

  ;(i18n.global as any).setLocaleMessage(`features.${namespace}`, nested)
}
