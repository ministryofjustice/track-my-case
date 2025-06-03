export declare module 'express-session' {
  // Declare that the session will potentially contain these additional fields
  interface SessionData {
    user: any
    identity: any
    landingPage?: boolean
    email?: boolean
    returnTo: string
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
      authSource: string
    }

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
