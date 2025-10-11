import { NextFunction, Request, Response } from 'express'
import superagent from 'superagent'
import config from '../config'
import { logger } from '../logger'
import { initialiseBasicAuthentication } from '../helpers/initialise-basic-authentication'
import paths from '../constants/paths'

async function backEndApiHealth(req: Request, res: Response, next: NextFunction) {
  try {
    await initialiseBasicAuthentication(req, res, next)

    if (!res.locals.allowDebug) {
      res.redirect(paths.CASES.DASHBOARD)
    }

    if (!config.apis.trackMyCaseApi.enabled) {
      res.status(503).send('API DISABLED')
      return
    }

    const { url } = config.apis.trackMyCaseApi
    const response = await superagent.get(`${url}/health`)
    const data = response.body
    const isHealthy = data.status === 'UP'

    res.send(isHealthy ? data : 'API DOWN')
  } catch (error) {
    logger.error(error)
    res.status(500).send(`API ERROR: ${JSON.stringify(error)}`)
  }
}

export default backEndApiHealth
