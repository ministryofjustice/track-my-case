import { i18nextReady } from './i18next'
import createApp from './app'

export default i18nextReady.then(() => createApp())
