import { Request, Response } from 'express'
import superagent from 'superagent'
import config from '../config'
import getAppInfo from '../applicationInfo'
import logger from '../../logger'

const healthCheck = async (req: Request, res: Response): Promise<void> => {
  const application = getAppInfo()
  const { trackMyCaseApi } = config.apis

  if (!trackMyCaseApi.enabled) {
    res.status(503).json({
      status: 'DOWN',
      application,
      reason: 'trackMyCaseApi is disabled in configuration',
    })
    return
  }

  try {
    const response = await superagent.get(`${trackMyCaseApi.url}/health`)
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
      error: err.message || 'Unknown error contacting trackMyCaseApi',
    })
  }
}

export default healthCheck
