import { afterEach, beforeEach, describe, expect, it } from 'vitest'

import { treeMessages } from '@/features/tree/i18n/treeMessages'
import { loginMessages } from '@/features/login/i18n/loginMessages'
import { i18n, SUPPORTED_LOCALES } from '@/i18n'
import { registerFeatureMessages } from '@/i18n/features'

const originalMessages = Object.fromEntries(
  SUPPORTED_LOCALES.map(locale => [
    locale,
    JSON.parse(JSON.stringify(i18n.global.getLocaleMessage(locale))),
  ]),
)

describe('registerFeatureMessages', () => {
  beforeEach(() => {
    i18n.global.locale.value = 'en'
  })

  afterEach(() => {
    for (const locale of SUPPORTED_LOCALES) {
      i18n.global.setLocaleMessage(locale, originalMessages[locale])
    }
  })

  it('registers feature messages under each supported locale', () => {
    registerFeatureMessages('tree', treeMessages)

    expect(i18n.global.t('features.tree.yourTrees')).toBe('Your Trees')

    i18n.global.locale.value = 'fr'

    expect(i18n.global.t('features.tree.yourTrees')).toBe('Vos arbres')
  })

  it('preserves base locale messages while registering features', () => {
    registerFeatureMessages('tree', treeMessages)

    expect(i18n.global.t('app.name')).toBe('Genealogist')
  })

  it('does not create pseudo-locales for feature namespaces', () => {
    registerFeatureMessages('tree', treeMessages)

    expect(i18n.global.availableLocales).not.toContain('features.tree')
  })

  it('keeps previously registered feature namespaces', () => {
    registerFeatureMessages('tree', treeMessages)
    registerFeatureMessages('login', loginMessages)

    expect(i18n.global.t('features.tree.yourTrees')).toBe('Your Trees')
    expect(i18n.global.t('features.login.submit')).toBe('Sign in')
  })
})
