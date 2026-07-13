import path from 'path'
import nunjucks from 'nunjucks'
import { initialiseName } from './utils'

import common from '../locales/common/en.json'
import home from '../locales/home/en.json'
import aboutTheService from '../locales/about-the-service/en.json'
import accessDenied from '../locales/access-denied/en.json'
import cookies from '../locales/cookies/en.json'
import privacyNotice from '../locales/privacy-notice/en.json'
import privateBetaSignIn from '../locales/private-beta-sign-in/en.json'
import signedIn from '../locales/signed-in/en.json'
import signedOut from '../locales/signed-out/en.json'
import dashboard from '../locales/case/dashboard/en.json'
import search from '../locales/case/search/en.json'
import courtInformation from '../locales/case/court-information/en.json'
import courtInfoAccessDenied from '../locales/case/court-info-access-denied/en.json'
import courtInfoUnavailable from '../locales/case/court-info-unavailable/en.json'
import courtInfoInactive from '../locales/case/court-info-inactive/en.json'
import courtInfoNoHearings from '../locales/case/court-info-no-hearings/en.json'
import courtInfoNotFound from '../locales/case/court-info-not-found/en.json'
import courtInfoGeneric from '../locales/case/court-info-generic/en.json'
import claimingExpenses from '../locales/case/claiming-expenses/en.json'
import keyRoles from '../locales/case/key-roles/en.json'
import requestingTranscript from '../locales/case/requesting-transcript/en.json'
import returnProperty from '../locales/case/return-property/en.json'
import serviceError from '../locales/case/service-error/en.json'
import specialMeasures from '../locales/case/special-measures/en.json'
import supportGuidance from '../locales/case/support-guidance/en.json'
import supportRoles from '../locales/case/support-roles/en.json'
import understandCompensation from '../locales/case/understand-compensation/en.json'
import victimPersonalStatement from '../locales/case/victim-personal-statement/en.json'
import victimSupportLinks from '../locales/case/victim-support-links/en.json'
import victimsCode from '../locales/case/victims-code/en.json'
import victimsJourney from '../locales/case/victims-journey/en.json'
import witnessService from '../locales/case/witness-service/en.json'

const namespaces: Record<string, Record<string, unknown>> = {
  common,
  home,
  'about-the-service': aboutTheService,
  'access-denied': accessDenied,
  cookies,
  'privacy-notice': privacyNotice,
  'private-beta-sign-in': privateBetaSignIn,
  'signed-in': signedIn,
  'signed-out': signedOut,
  dashboard,
  search,
  'court-information': courtInformation,
  'court-info-access-denied': courtInfoAccessDenied,
  'court-info-unavailable': courtInfoUnavailable,
  'court-info-inactive': courtInfoInactive,
  'court-info-no-hearings': courtInfoNoHearings,
  'court-info-not-found': courtInfoNotFound,
  'court-info-generic': courtInfoGeneric,
  'claiming-expenses': claimingExpenses,
  'key-roles': keyRoles,
  'requesting-transcript': requestingTranscript,
  'return-property': returnProperty,
  'service-error': serviceError,
  'special-measures': specialMeasures,
  'support-guidance': supportGuidance,
  'support-roles': supportRoles,
  'understand-compensation': understandCompensation,
  'victim-personal-statement': victimPersonalStatement,
  'victim-support-links': victimSupportLinks,
  'victims-code': victimsCode,
  'victims-journey': victimsJourney,
  'witness-service': witnessService,
}

const interpolate = (str: string, vars: Record<string, unknown>): string =>
  str.replace(/\{\{(\w+)\}\}/g, (_, name) => String(vars[name] ?? `{{${name}}}`))

const t = (key: string, options?: Record<string, unknown>): unknown => {
  const sep = key.indexOf(':')
  const ns = sep !== -1 ? key.slice(0, sep) : 'common'
  const localKey = sep !== -1 ? key.slice(sep + 1) : key
  const locale = namespaces[ns] ?? {}

  // Try flat key first (e.g. "section.heading" stored as a literal key)
  let value: unknown = (locale as Record<string, unknown>)[localKey]

  // Fall back to nested path navigation supporting dot notation (including numeric indices for arrays)
  // e.g. "stage1.list1.0" → locale.stage1.list1[0]
  if (value === undefined) {
    value = localKey.split('.').reduce((obj: unknown, part: string) => {
      if (Array.isArray(obj) && /^\d+$/.test(part)) {
        return obj[Number(part)]
      }
      return (obj as Record<string, unknown>)?.[part]
    }, locale as unknown)
  }

  if (value === undefined) {
    return key
  }
  if (typeof value === 'string' && options) {
    return interpolate(value, options)
  }
  return value
}

export function createNunjucksEnv(): nunjucks.Environment {
  const viewPaths = [
    path.join(__dirname, '../views'),
    path.join(__dirname, '../../node_modules/govuk-frontend/dist/'),
    path.join(__dirname, '../../node_modules/@ministryofjustice/frontend/'),
  ]
  const env: nunjucks.Environment = nunjucks.configure(viewPaths, { autoescape: false })
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
  t,
  translations: {
    options: [
      { href: '/?lng=en', code: 'en', label: 'English', changeLanguageText: 'Change the language to English' },
      { href: '/?lng=cy', code: 'cy', label: 'Gymraeg', changeLanguageText: "Newid yr iaith i'r Gymraeg" },
    ],
    currentLanguageCode: 'en',
  },
}
