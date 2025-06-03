import superagent from 'superagent'
import config from '../config'
import logger from '../logger'

type GetRequestOptions = {
  path: string
}

export default class TrackMyCaseApiClient {
  constructor(private readonly baseUrl = config.apis.trackMyCaseApi.url) {}

  async get<T>({ path }: GetRequestOptions): Promise<T> {
    const url = `${this.baseUrl}${path}`
    logger.debug('[TrackMyCaseApiClient] GET:', url)
    const { body } = await superagent.get(`${this.baseUrl}${path}`)
    return body as T
  }
}
