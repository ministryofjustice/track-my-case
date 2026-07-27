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

// eslint-disable-next-line import/prefer-default-export
export const createMockT = (): jest.Mock =>
  jest.fn((key: string) => {
    const sep = key.indexOf(':')
    const ns = sep !== -1 ? key.slice(0, sep) : 'common'
    const localKey = sep !== -1 ? key.slice(sep + 1) : key
    const locale = namespaces[ns] ?? {}
    const value = localKey
      .split('.')
      .reduce(
        (obj: Record<string, unknown>, part: string) =>
          (obj as Record<string, unknown>)?.[part] as Record<string, unknown>,
        locale as Record<string, unknown>,
      )
    return (value as unknown as string) ?? key
  })
