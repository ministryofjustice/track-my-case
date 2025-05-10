import { Request, Response } from 'express'
import superagent from 'superagent'
import logger from '../../logger'

async function courtInfoHealthCheck(req: Request, res: Response) {
  try {
    const response = await superagent.get('http://localhost:4550/health')
    const data = response.body
    const isHealthy = data.status === 'UP'
    res.send(isHealthy ? 'API OK' : 'API DOWN')
  } catch (err) {
    logger.error(err)
    res.status(500).send('API ERROR')
  }
}

export default courtInfoHealthCheck
