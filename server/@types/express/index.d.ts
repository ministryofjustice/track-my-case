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
      username: string
      token: string
      authSource: string
    }

    interface Request {
      verified?: boolean
      id: string

      logout(done: (err: unknown) => void): void
    }
  }
}
