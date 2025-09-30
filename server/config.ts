import { UserIdentityClaim } from './@types/types/user-info'
import DIDKeySet from './@types/types/did-keyset'
import { toBoolean } from './utils/utils'

const isProduction = process.env.NODE_ENV === 'production'

function get<T>(name: string, fallback: T, options = { requireInProduction: false }): T | string {
  if (process.env[name]) {
    return process.env[name]
  }
  if (fallback !== undefined && (!isProduction || !options.requireInProduction)) {
    return fallback
  }
  throw new Error(`Missing env var ${name}`)
}

const requiredInProduction = { requireInProduction: true }

export class AgentConfig {
  // Sets the working socket to timeout after timeout milliseconds of inactivity on the working socket.
  timeout: number

  constructor(timeout = 8000) {
    this.timeout = timeout
  }
}

export interface ApiConfig {
  url: string
  timeout: {
    // sets maximum time to wait for the first byte to arrive from the server, but it does not limit how long the
    // entire download can take.
    response: number
    // sets a deadline for the entire request (including all uploads, redirects, server processing time) to complete.
    // If the response isn't fully downloaded within that time, the request will be aborted.
    deadline: number
  }
  agent: AgentConfig
}

const replacePort = (url: string, port: string): string => {
  if (url.includes(':port')) {
    return url.replace(':port', `:${port}`)
  }
  return url
}

const port = get('NODE_PORT', '9999')
const serviceUrl = replacePort(get('SERVICE_URL', ''), port)

const oidcIssuer = get('OIDC_ISSUER', '', requiredInProduction)

const config = {
  buildNumber: get('BUILD_NUMBER', '1_0_0', requiredInProduction),
  productId: get('PRODUCT_ID', 'UNASSIGNED', requiredInProduction),
  branchName: get('GIT_BRANCH', 'main', requiredInProduction),
  gitRef: get('GIT_REF', 'HEAD', requiredInProduction),
  nodeEnv: get('NODE_ENV', 'development', requiredInProduction),
  port,
  production: isProduction,
  serviceUrl,
  https: process.env.NO_HTTPS === 'true' ? false : isProduction,
  staticResourceCacheDuration: '1h',
  environmentName: get('ENVIRONMENT_NAME', ''),
  redis: {
    enabled: get('REDIS_ENABLED', 'false', requiredInProduction) === 'true',
    // host: get('REDIS_HOST', 'localhost', requiredInProduction),
    // port: parseInt(process.env.REDIS_PORT, 10) || 6379,
    // password: process.env.REDIS_AUTH_TOKEN,
    // tls_enabled: get('REDIS_TLS_ENABLED', 'false'),
  },
  apis: {
    govukOneLogin: {
      url: oidcIssuer,
      jwksUrl: `${oidcIssuer}/.well-known/jwks.json`,
      discoveryUrl: `${oidcIssuer}/.well-known/openid-configuration`,
      clientId: get('OIDC_CLIENT_ID', '', requiredInProduction),
      privateKey: get('OIDC_PRIVATE_KEY', '', requiredInProduction),
      idTokenSigningAlgorithm: 'ES256',
      timeout: 20000,
      strategyName: 'oidc',
      oneLoginLink: get('ONE_LOGIN_LINK', 'https://home.account.gov.uk', requiredInProduction),
      ivIssuer: get('IV_ISSUER', '', requiredInProduction),
      ivDidUri: get('IV_DID_URI', '', requiredInProduction),
      scopes: get('OIDC_SCOPES', 'email,openid', requiredInProduction),
      authorizeRedirectUrl: replacePort(get('OIDC_AUTHORIZE_REDIRECT_URL', '', requiredInProduction), port),
      postLogoutRedirectUrl: replacePort(get('OIDC_POST_LOGOUT_REDIRECT_URL', '', requiredInProduction), port),
      backChannelLogoutUri: replacePort(get('OIDC_BACK_CHANNEL_LOGOUT_URI', ''), port),
      claims: get('OIDC_CLAIMS', 'https://vocab.account.gov.uk/v1/coreIdentityJWT', requiredInProduction).split(
        ',',
      ) as UserIdentityClaim[],
      tokenAuthMethod: get('OIDC_TOKEN_AUTH_METHOD', 'private_key_jwt', requiredInProduction),
      ivPublicKeys: [] as DIDKeySet[],
      authenticationVtr: get('AUTH_VECTOR_OF_TRUST', 'Cl.Cm', requiredInProduction),
      identityVtr: get('IDENTITY_VECTOR_OF_TRUST', 'Cl.Cm.P2', requiredInProduction),
      uiLocales: get('UI_LOCALES', 'en', requiredInProduction),
      immediateRedirect: get('IMMEDIATE_REDIRECT', 'false', requiredInProduction) === 'true',
      requireJAR: get('REQUIRE_JAR', 'false', requiredInProduction) === 'true',
      identitySupported: get('IDENTITY_SUPPORTED', 'false', requiredInProduction) === 'true',
    },
    trackMyCaseApi: {
      url: get('TRACK_MY_CASE_API_URL', 'http://localhost:4550', requiredInProduction),
      timeout: {
        response: Number(get('TRACK_MY_CASE_API_TIMEOUT_RESPONSE', 30000)),
        deadline: Number(get('TRACK_MY_CASE_API_TIMEOUT_DEADLINE', 30000)),
      },
      agent: new AgentConfig(Number(get('TRACK_MY_CASE_API_TIMEOUT_RESPONSE', 15000))),
      enabled: get('TRACK_MY_CASE_API_ENABLED', 'false') === 'true',
    },
  },
  session: {
    name: get('SESSION_NAME', 'track-my-case-insecure-default-session'),
    secret: get('SESSION_SECRET', 'track-my-case-insecure-default-session', requiredInProduction),
    expiryMinutes: Number(get('WEB_SESSION_TIMEOUT_IN_MINUTES', 120)),
    inactivityMinutes: Number(get('WEB_SESSION_INACTIVITY_IN_MINUTES', 10)),
    appointmentsCacheMinutes: Number(get('APPOINTMENTS_CACHE_IN_MINUTES', 1)),
    allowDebug: toBoolean(get('ALLOW_DEBUG', false)),
  },
  rateLimit: {
    limit: Number(get('RATE_LIMIT_MAX_REQUESTS', 300, requiredInProduction)),
    windowMs: Number(get('RATE_LIMIT_WINDOW_SECS', 5 * 60, requiredInProduction)) * 1000,
    message: 'Too many requests, please try again later.',
  },
  // ingressUrl: get('INGRESS_URL', 'http://localhost:9999'),
}
export default config
