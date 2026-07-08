import path from 'path'
import i18next from 'i18next'
import FsBackend from 'i18next-fs-backend'
import middleware from 'i18next-http-middleware'

export const i18nextReady = i18next
  .use(FsBackend)
  .use(middleware.LanguageDetector)
  .init({
    fallbackLng: 'en',
    supportedLngs: ['en', 'cy'],
    preload: ['en', 'cy'],
    ns: ['translation'],
    defaultNS: 'translation',
    backend: {
      loadPath: path.join(__dirname, 'locales/{{lng}}.json'),
    },
    detection: {
      order: ['querystring', 'cookie'],
      lookupQuerystring: 'lng',
      lookupCookie: 'i18next',
      caches: ['cookie'],
    },
  })

export default i18next
