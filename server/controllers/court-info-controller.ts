import { NextFunction, Request, Response } from 'express'
import superagent from 'superagent'
import config from '../config'
import { logger } from '../logger'

async function courtInfoHealthCheck(req: Request, res: Response, next: NextFunction) {
  try {
    const { url } = config.apis.trackMyCaseApi

    if (!config.apis.trackMyCaseApi.enabled) {
      res.status(503).send('API DISABLED')
      return
    }

    const response = await superagent.get(`${url}/health`)
    const data = response.body
    const isHealthy = data.status === 'UP'

    res.send(isHealthy ? data : 'API DOWN')
  } catch (error) {
    logger.error(error)
    res.status(500).send(`API ERROR: ${JSON.stringify(error)}`)
  }
}

export default courtInfoHealthCheck
