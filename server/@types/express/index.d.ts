export declare module 'express-session' {
  // Declare that the session will potentially contain these additional fields
  interface SessionData {
    passport?: {
      user?: Express.User
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
