import superagent from 'superagent'
import config from '../config'
import { logger } from '../logger'

type GetRequestOptions = {
  path: string
}

export default class TrackMyCaseApiClient {
  constructor(private readonly baseUrl = config.apis.trackMyCaseApi.url) {}

  async get<T>({ path }: GetRequestOptions): Promise<T> {
    const url = `${this.baseUrl}${path}`
    const { body } = await superagent.get(url)
    return body as T
  }
}
