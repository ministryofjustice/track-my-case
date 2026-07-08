import { i18nextReady } from './i18next'
import createApp from './app'

const trackMyCaseApp = (sessionSecret: string) => createApp(sessionSecret)

export default i18nextReady.then(() => trackMyCaseApp)
