import superagent from 'superagent'
import config from '../config'
import { ApiServiceHealth, CaseDetails } from '../interfaces/caseDetails'

export type GetRequestOptions = {
  path: string
}

export type GetPathAndEmailRequestOptions = {
  path: string
  userEmail: string
}

export type GetEmailRequestOptions = {
  userEmail: string
}

export default class TrackMyCaseApiClient {
  constructor(private readonly baseUrl = config.apis.trackMyCaseApi.url) {}

  async getHealth(): Promise<ApiServiceHealth> {
    const url = `${this.baseUrl}/health`
    const response = await superagent.get(url)
    return {
      status: response?.body?.status,
    }
  }

  async getCaseDetailsByUrn({ path, userEmail }: GetPathAndEmailRequestOptions): Promise<CaseDetails> {
    const url = `${this.baseUrl}${path}`
    const request = superagent.get(url)
    const encoded = Buffer.from(userEmail).toString('base64')
    request.set('Authorization', `Basic ${encoded}`)
    const { body } = await request
    return body as CaseDetails
  }

  async isActiveUser({ userEmail }: GetEmailRequestOptions): Promise<boolean> {
    try {
      const url = `${this.baseUrl}/api/cases/active-user`
      const request = superagent.get(url)
      const encoded = Buffer.from(userEmail).toString('base64')
      request.set('Authorization', `Basic ${encoded}`)
      await request
      return true
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
      return false
    }
  }
}
