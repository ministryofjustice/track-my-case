import { Router } from 'express'
import healthCheck from '../controllers/health-controller'

export default function healthRoutes(): Router {
  const router = Router()
  router.get('/health', healthCheck)
  router.get('/healthz', healthCheck)
  return router
}
