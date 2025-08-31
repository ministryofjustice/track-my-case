import { CaseConfirmFormData, CaseSelectFormData } from '../../interfaces/formSchemas'

export declare module 'express-session' {
  // Declare that the session will potentially contain these additional fields
  interface SessionData {
    passport?: {
      user?: Express.User
    }
    selectedUrn?: string
    selectedCrn?: string
    caseConfirmed?: boolean
    formState?: {
      caseSelect?: FormState<CaseSelectFormData>
      confirmCase?: FormState<CaseConfirmFormData>
      // Add other form keys here as needed
    }
    returnTo?: string
    nowInMinutes: number
  }
}

export declare global {
  namespace Express {
    interface User {
      sub: string
      email?: string
      email_verified?: boolean
      phone_number?: string
      phone_number_verified?: boolean
      token?: string
      username: string
      authSource: AuthSource
    }

    // a way to define different authorisation sources
    // export type AuthSource = 'external' | 'nomis' | 'delius' | 'azuread'
    export type AuthSource = 'onelogin'

    interface Request {
      verified?: boolean
      id: string
      logout(done: (err: unknown) => void): void
      t: (s: string) => string
      body: unknown
    }

    interface Locals {
      user: Express.User
    }

    interface ValidationError {
      href: string
      text: string
    }
  }
}
