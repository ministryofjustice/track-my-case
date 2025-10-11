import crypto from 'crypto'
import express, { Router, Request, Response, NextFunction } from 'express'
import helmet from 'helmet'

export default function setUpWebSecurity(): Router {
  const router = express.Router()

  // Secure code best practice - see:
  // 1. https://expressjs.com/en/advanced/best-practice-security.html,
  // 2. https://www.npmjs.com/package/helmet
  router.use((_req: Request, res: Response, next: NextFunction) => {
    res.locals.cspNonce = crypto.randomBytes(16).toString('hex')
    next()
  })
  router.use(
    helmet({
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          defaultSrc: ["'self'"],

          // prevent <base> tag abuse
          baseUri: ["'self'"],

          // block plugins/Flash-like embeds
          objectSrc: ["'none'"],

          // CSP way to forbid framing (prefer over X-Frame-Options)
          frameAncestors: ["'none'"],

          scriptSrc: [
            "'self'",
            "'strict-dynamic'",
            'https://www.googletagmanager.com',
            'https://www.google-analytics.com',
            (_req: Request, res: Response) => `'nonce-${res.locals.cspNonce}'`,
          ],

          // Styles: prefer nonce; include Google Fonts
          styleSrc: [
            "'self'",
            'https://fonts.googleapis.com',
            (_req: Request, res: Response) => `'nonce-${res.locals.cspNonce}'`,
          ],

          // Fonts for Google Fonts
          fontSrc: ["'self'", 'https://fonts.gstatic.com'],

          // Images
          imgSrc: [
            "'self'",
            'https://www.google-analytics.com',
            'https://www.googletagmanager.com',
            'https://*.google-analytics.com',
            'https://*.g.doubleclick.net',
            'data:',
          ],

          // XHR/fetch
          connectSrc: [
            "'self'",
            'https://www.googletagmanager.com',
            'https://www.google-analytics.com',
            'https://*.google-analytics.com',
            'https://*.g.doubleclick.net',
            'https://js.monitor.azure.com',
            'https://dc.services.visualstudio.com',
          ],

          // For GTM noscript iframe
          frameSrc: ["'self'", 'https://www.googletagmanager.com'],
          formAction: [`'self'`],
        },
      },

      // COEP often breaks 3rd-party iframes/analytics; leave disabled unless needed
      crossOriginEmbedderPolicy: false,

      referrerPolicy: { policy: 'strict-origin-when-cross-origin' },

      // Deny being framed (anti-clickjacking); OK with GTM since GTM is framed by us, not vice versa
      frameguard: { action: 'deny' },

      // HSTS: only if served via HTTPS (typical for prod)
      hsts: {
        maxAge: 31536000,
        includeSubDomains: true,
        preload: true,
      },
    }),
  )
  return router
}
