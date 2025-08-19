const paths = {
  START: '/',
  HEALTH: '/health',

  AUTH_ERROR: '/autherror',

  PASSPORT: {
    // these routes are reserved for passport integration
    SIGN_IN: '/sign-in',
    SIGN_OUT: '/sign-out',
    AUTH_CALLBACK: '/oidc/authorization-code/callback',
  },

  ONE_LOGIN: {
    // OneLogin redirection URLs
    SIGNED_IN: '/signed-in',
    SIGNED_OUT: '/signed-out',
    AUTH_ERROR: '/authentication-error',
    BACK_CHANNEL_LOGOUT_URI: '/back-channel-logout-uri',
  },

  CASES: {
    SEARCH: '/case/search',
    SELECT: '/case/select',
    CONFIRM_CASE: '/case/confirm-case',
    DASHBOARD: '/case/dashboard',
    CONTACT_DETAILS: '/case/contact-details',
    COURT_INFORMATION: '/case/court-information',
    COURT_INFORMATION_OLD: '/case/court-information-old',
    COURT_INFO_HEALTH: '/case/court-info-health',
    HEARINGS: '/cases/:caseId/hearings',
    // TODO: Replace with dynamic caseId path once API contract is finalized
    INFO: '/case/:caseId/courtschedule',
    CASE_DETAILS: '/case/:urn/casedetails',
    ASSOCIATIONS: '/cases/:sub',
  },

  COURT_HOUSE: {
    DETAIL: '/courthouses/:courtHouseId',
  },
}

export default paths
