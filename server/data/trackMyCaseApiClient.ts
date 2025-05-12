import superagent from 'superagent'
import config from '../config'

type GetRequestOptions = {
  path: string
}

export default class TrackMyCaseApiClient {
  constructor(private readonly baseUrl = config.apis.trackMyCaseApi.url) {}

  async get<T>({ path }: GetRequestOptions): Promise<T> {
    const { body } = await superagent.get(`${this.baseUrl}${path}`)
    return body as T
  }
}
