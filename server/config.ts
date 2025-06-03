const production = process.env.NODE_ENV === 'production'

function get<T>(name: string, fallback: T, options = { requireInProduction: false }): T | string {
  if (process.env[name]) {
    return process.env[name]
  }
  if (fallback !== undefined && (!production || !options.requireInProduction)) {
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

export default {
  buildNumber: get('BUILD_NUMBER', '1_0_0', requiredInProduction),
  productId: get('PRODUCT_ID', 'UNASSIGNED', requiredInProduction),
  gitRef: get('GIT_REF', 'xxxxxxxxxxxxxxxxxxx', requiredInProduction),
  branchName: get('GIT_BRANCH', 'xxxxxxxxxxxxxxxxxxx', requiredInProduction),
  production,
  https: process.env.NO_HTTPS === 'true' ? false : production,
  staticResourceCacheDuration: '1h',
  environmentName: get('ENVIRONMENT_NAME', ''),
  domain: get('SERVICE_URL', ''),
  redis: {
    enabled: get('REDIS_ENABLED', 'false', requiredInProduction) === 'true',
    // host: get('REDIS_HOST', 'localhost', requiredInProduction),
    // port: parseInt(process.env.REDIS_PORT, 10) || 6379,
    // password: process.env.REDIS_AUTH_TOKEN,
    // tls_enabled: get('REDIS_TLS_ENABLED', 'false'),
  },
  apis: {
    hmppsAuth: {
      url: get('HMPPS_AUTH_URL', 'http://localhost:9091/auth', requiredInProduction),
      healthPath: '/health/ping',
      externalUrl: get('HMPPS_AUTH_EXTERNAL_URL', get('HMPPS_AUTH_URL', 'http://localhost:9092/auth')),
      timeout: {
        response: Number(get('HMPPS_AUTH_TIMEOUT_RESPONSE', 10000)),
        deadline: Number(get('HMPPS_AUTH_TIMEOUT_DEADLINE', 10000)),
      },
      agent: new AgentConfig(Number(get('HMPPS_AUTH_TIMEOUT_RESPONSE', 10000))),
      authClientId: get('AUTH_CODE_CLIENT_ID', 'clientid', requiredInProduction),
      authClientSecret: get('AUTH_CODE_CLIENT_SECRET', 'clientsecret', requiredInProduction),
      systemClientId: get('CLIENT_CREDS_CLIENT_ID', 'clientid', requiredInProduction),
      systemClientSecret: get('CLIENT_CREDS_CLIENT_SECRET', 'clientsecret', requiredInProduction),
    },
    govukOneLogin: {
      url: get('OIDC_ISSUER', '', requiredInProduction),
      homeUrl: get('OIDC_ISSUER_HOME', '', requiredInProduction),
      clientId: get('OIDC_CLIENT_ID', '', requiredInProduction),
      privateKey: get('OIDC_PRIVATE_KEY', '', requiredInProduction),
      timeout: 20000,
      vtr: get('AUTH_VECTOR_OF_TRUST', '', requiredInProduction),
      jwksUrl: get('OIDC_ISSUER', '', requiredInProduction) + '/.well-known/jwks.json',
      strategyName: 'oidc',
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
    secret: get('SESSION_SECRET', 'app-insecure-default-session', requiredInProduction),
    expiryMinutes: Number(get('WEB_SESSION_TIMEOUT_IN_MINUTES', 120)),
    inactivityMinutes: Number(get('WEB_SESSION_INACTIVITY_IN_MINUTES', 10)),
    appointmentsCacheMinutes: Number(get('APPOINTMENTS_CACHE_IN_MINUTES', 1)),
  },
  ingressUrl: get('INGRESS_URL', 'http://localhost:3000', requiredInProduction),
}
