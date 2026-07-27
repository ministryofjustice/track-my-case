import { i18nextReady } from './middleware/i18next'
import createApp from './app'

const trackMyCaseApp = (sessionSecret: string) => createApp(sessionSecret)

export default i18nextReady.then(() => trackMyCaseApp)
