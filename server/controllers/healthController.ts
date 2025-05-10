import { Request, Response } from 'express'
import superagent from 'superagent'
import getAppInfo from '../applicationInfo'
import logger from '../../logger'

async function healthCheck(req: Request, res: Response) {
  const application = getAppInfo()

  try {
    const response = await superagent.get('http://localhost:4550/health')
    const upstream = response.body

    res.status(200).json({
      status: 'UP',
      application,
      upstream,
    })
  } catch (err) {
    logger.error(err)
    res.status(503).json({
      status: 'DOWN',
      application,
      error: err.message || 'Unknown error',
    })
  }
}

export default healthCheck
