const paths = {
  START: '/',
  HEALTH: '/health',

  ACCESS_DENIED: '/access-denied',
  AUTH_CALLBACK_OLD: '/auth/callback',
  AUTH_CALLBACK: '/oidc/authorization-code/callback',
  AUTH_ERROR: '/autherror',
  SIGN_IN: '/sign-in',
  SIGN_OUT: '/sign-out',
  SIGNED_IN: '/signed-in',
  SIGNED_OUT: '/signed-out',

  CASES: {
    SELECT: '/case/select',
    DASHBOARD: '/case/dashboard',
    HEARINGS: '/cases/:caseId/hearings',
    // TODO: Replace with dynamic caseId path once API contract is finalized
    INFO: '/case/:caseId/courtschedule',
    CASE_DETAILS: '/case/:urn/casedetails',
  },

  COURT_HOUSE: {
    DETAIL: '/courthouses/:courtHouseId',
  },
}

export default paths
