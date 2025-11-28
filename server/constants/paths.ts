const paths = {
  START: '/',
  HEALTHZ: '/healthz',
  ABOUT_THE_SERVICE: '/about-the-service',
  COOKIES: '/cookies',
  COOKIES_DECISION: '/cookies/decision',

  AUTH_ERROR: '/autherror',
  ACCESS_DENIED: '/access-denied',

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
    DASHBOARD: '/case/dashboard',
    CONTACT_DETAILS: '/case/contact-details',
    COURT_INFORMATION: '/case/court-information',
    SUPPORT_GUIDANCE: '/case/support-guidance',
    SUPPORT_ROLES: '/case/support-roles',
    VICTIMS_JOURNEY: '/case/victims-journey',
    VICTIMS_CODE: '/case/victims-code',
    RETURN_PROPERTY: '/case/return-property',
    UNDERSTAND_COMPENSATION: '/case/understand-compensation',
    VICTIM_PERSONAL_STATEMENT: '/case/victim-personal-statement',
    VICTIM_SUPPORT_LINKS: '/case/victim-support-links',
    WITNESS_SERVICE: '/case/witness-service',
  },

  COURT_HOUSE: {
    DETAIL: '/courthouses/:courtHouseId',
  },
}

export default paths
