import session, { MemoryStore, Store } from 'express-session'
import express, { Router } from 'express'
import { randomUUID } from 'crypto'
import config from '../config'

export default function setUpWebSession(): Router {
  let store: Store
  if (config.redis.enabled) {
    throw new Error('No Redis implemented yet')
  } else {
    store = new MemoryStore()
  }

  const router = express.Router()
  // Set up a session to track whether the user is logged in
  router.use(
    session({
      store,
      name: config.session.name,
      secret: config.session.secret,
      cookie: {
        secure: !!config.https,
        httpOnly: true,
        sameSite: 'lax',
        maxAge: config.session.expiryMinutes * 60 * 1000,
      },
      resave: false, // redis implements touch so shouldn't need this
      saveUninitialized: false,
      rolling: true,
    }),
  )

  // Update a value in the cookie so that the set-cookie will be sent.
  // Only changes every minute so that it's not sent with every request.
  router.use((req, res, next) => {
    req.session.nowInMinutes = Math.floor(Date.now() / 60e3)
    next()
  })

  router.use((req, res, next) => {
    const headerName = 'X-Request-Id'
    const oldValue = req.get(headerName)
    const id = oldValue === undefined ? randomUUID() : oldValue

    res.set(headerName, id)
    req.id = id

    next()
  })

  return router
}
