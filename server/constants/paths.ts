const paths = {
  START: '/',
  HEALTH: '/health',
  ABOUT_THE_SERVICE: '/about-the-service',
  PRIVACY_NOTICE: '/privacy-notice',
  COOKIES: '/cookies',
  COOKIES_DECISION: '/cookies/decision',
  FEEDBACK_DECISION: '/feedback/decision',

  AUTH_ERROR: '/autherror',
  ACCESS_DENIED: '/access-denied',

  PRIVATE_BETA_SIGN_IN: '/private-beta-sign-in',

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
    DASHBOARD: '/case/dashboard',

    SEARCH: '/case/search',
    COURT_INFORMATION: '/case/court-information',

    VICTIMS_JOURNEY: '/case/victims-journey',

    KEY_ROLES: '/case/key-roles',

    VICTIM_PERSONAL_STATEMENT: '/case/victim-personal-statement',
    CLAIMING_EXPENSES: '/case/claiming-expenses',
    UNDERSTAND_COMPENSATION: '/case/understand-compensation',
    RETURN_PROPERTY: '/case/return-property',
    VICTIMS_CODE: '/case/victims-code',

    VICTIM_SUPPORT_LINKS: '/case/victim-support-links',
    WITNESS_SERVICE: '/case/witness-service',
  },
}

export default paths
