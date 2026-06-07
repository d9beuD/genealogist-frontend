import { registerFeatureMessages } from '@/i18n/features'

import { loginMessages } from './login/i18n/loginMessages'
import { registrationMessages } from './registration/i18n/registrationMessages'
import { treeMessages } from './tree/i18n/treeMessages'

export function registerFeatures() {
  registerFeatureMessages('tree', treeMessages)
  registerFeatureMessages('login', loginMessages)
  registerFeatureMessages('registration', registrationMessages)
}
