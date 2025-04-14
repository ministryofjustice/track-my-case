import { Router } from 'express'

const router = Router()

router.get('/', (_req, res) => {
  res.render('pages/index', {
    currentTime: new Date().toISOString(),
  })
})

export default router
