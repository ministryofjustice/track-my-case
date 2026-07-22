import path from 'path'
import i18next from 'i18next'
import FsBackend from 'i18next-fs-backend'
import middleware from 'i18next-http-middleware'

const caseNamespaces = new Set([
  'dashboard',
  'search',
  'court-information',
  'court-info-access-denied',
  'court-info-unavailable',
  'court-info-inactive',
  'court-info-no-hearings',
  'court-info-not-found',
  'court-info-generic',
  'claiming-expenses',
  'key-roles',
  'requesting-transcript',
  'return-property',
  'service-error',
  'special-measures',
  'support-guidance',
  'support-roles',
  'understand-compensation',
  'victim-personal-statement',
  'victim-support-links',
  'victims-code',
  'victims-journey',
  'witness-service',
])

export const i18nextReady = i18next
  .use(FsBackend)
  .use(middleware.LanguageDetector)
  .init({
    fallbackLng: 'en',
    supportedLngs: ['en', 'cy'],
    preload: ['en', 'cy'],
    ns: [
      'common',
      'home',
      'about-the-service',
      'access-denied',
      'cookies',
      'privacy-notice',
      'private-beta-sign-in',
      'signed-in',
      'signed-out',
      ...caseNamespaces,
    ],
    defaultNS: 'common',
    backend: {
      loadPath: (lng: string, ns: string) => {
        if (caseNamespaces.has(ns)) {
          return path.join(__dirname, `../locales/case/${ns}/${lng}.json`)
        }
        return path.join(__dirname, `../locales/${ns}/${lng}.json`)
      },
    },
    detection: {
      order: ['querystring', 'cookie'],
      lookupQuerystring: 'lng',
      lookupCookie: 'i18next',
      caches: ['cookie'],
    },
  })

export default i18next
