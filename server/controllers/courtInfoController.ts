import { Request, Response } from 'express'
import superagent from 'superagent'
import logger from '../../logger'
import config from '../config'

async function courtInfoHealthCheck(req: Request, res: Response) {
  try {
    const { url } = config.apis.trackMyCaseApi

    if (!config.apis.trackMyCaseApi.enabled) {
      res.status(503).send('API DISABLED')
      return
    }

    const response = await superagent.get(`${url}/health`)
    const data = response.body
    const isHealthy = data.status === 'UP'

    res.send(isHealthy ? 'API OK' : 'API DOWN')
  } catch (err) {
    logger.error(err)
    res.status(500).send('API ERROR')
  }
}

export default courtInfoHealthCheck
