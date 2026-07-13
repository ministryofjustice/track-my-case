import path from 'path'
import nunjucks from 'nunjucks'
import { initialiseName } from './utils'

export function createNunjucksEnv(): nunjucks.Environment {
  const viewPaths = [
    path.join(__dirname, '../views'),
    path.join(__dirname, '../../node_modules/govuk-frontend/dist/'),
    path.join(__dirname, '../../node_modules/@ministryofjustice/frontend/'),
  ]
  const env = nunjucks.configure(viewPaths, { autoescape: false })
  env.addFilter('initialiseName', initialiseName)
  env.addFilter('assetMap', (url: string) => url)
  return env
}

export const renderPage = (env: nunjucks.Environment, template: string, context: Record<string, unknown>): string =>
  env
    .render(template, context)
    .replace(/^\s*$/gm, '')
    .replace(/\n{2,}/g, '\n')

/** Fixed locals used across all snapshot renders — keeps snapshots stable across runs. */
export const baseContext: Record<string, unknown> = {
  applicationName: 'Track a case',
  cspNonce: 'test-nonce',
  csrfToken: 'test-csrf',
  cookieAccepted: true,
  correctPasswordAndNotExpired: false,
  authenticated: false,
  quickExitWindowMs: 5000,
  t: (key: string) => key,
  translations: {
    options: [
      { href: '/?lng=en', code: 'en', label: 'English', changeLanguageText: 'Change the language to English' },
      { href: '/?lng=cy', code: 'cy', label: 'Gymraeg', changeLanguageText: "Newid yr iaith i'r Gymraeg" },
    ],
    currentLanguageCode: 'en',
  },
}
