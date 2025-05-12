import superagent from 'superagent'
import config from '../config'

import { UpstreamHealth } from '../interfaces/upstreamHealth'

export default class TrackMyCaseApiClient {
  constructor(private readonly baseUrl = config.apis.trackMyCaseApi.url) {}

  async getHealth(): Promise<UpstreamHealth> {
    const { body } = await superagent.get(`${this.baseUrl}/health`)
    return body
  }
}
