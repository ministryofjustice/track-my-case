import { UserIdentityClaim } from './user-info.js'
import DIDKeySet from './did-keyset.js'

export default interface ClientConfiguration {
  nodeEnv: string
  clientId?: string
  privateKey?: string
  clientSecret?: string
  issuer?: string
  discoveryUrl?: string
  ivIssuer?: string
  ivDidUri?: string
  ivPublicKeys?: DIDKeySet[]
  scopes: string[]
  authorizeRedirectUrl?: string
  postLogoutRedirectUrl?: string
  claims: UserIdentityClaim[]
  tokenAuthMethod: string
  authenticationVtr: string
  identityVtr: string
  uiLocales: string
  serviceUrl?: string
  immediateRedirect: boolean
  requireJAR: boolean
  identitySupported: boolean
}
