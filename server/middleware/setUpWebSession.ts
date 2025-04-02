import session, { MemoryStore, Store } from 'express-session'
import express, { Router } from 'express'
import { randomUUID } from 'crypto'
import config from '../config'

export default function setUpWebSession(): Router {
  let store: Store
  
  store = new MemoryStore()


  const router = express.Router()
  router.use(
    session({
      store,
      name: 'stg-track-my-case-ui.session',
      cookie: { secure: config.https, sameSite: 'lax', maxAge: config.session.expiryMinutes * 60 * 1000 },
      secret: config.session.secret,
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

  // Generate and store a unique user ID in the session
  router.use((req, res, next) => {
    if (!req.session.user_id) {
      req.session.user_id = randomUUID()
    }
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
