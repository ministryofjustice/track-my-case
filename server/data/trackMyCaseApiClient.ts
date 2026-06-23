import superagent from 'superagent'
import config from '../config'
import { ApiServiceHealth, CaseDetails } from '../interfaces/caseDetails'

export type GetPathAndEmailRequestOptions = {
  path: string
  userEmail: string
  userId: string
}

export type GetEmailRequestOptions = {
  userEmail: string
  userId: string
}

export default class TrackMyCaseApiClient {
  constructor(private readonly baseUrl = config.apis.trackMyCaseApi.url) {}

  async getHealth(): Promise<ApiServiceHealth> {
    const url = `${this.baseUrl}/api/health`
    const response = await superagent.get(url)
    return {
      status: response?.body?.status || response?.text,
    }
  }

  async getCaseDetailsByUrn({ path, userEmail, userId }: GetPathAndEmailRequestOptions): Promise<CaseDetails> {
    const url = `${this.baseUrl}${path}`
    const request = superagent.get(url)
    const encoded = Buffer.from(userEmail).toString('base64')
    request.set('Authorization', `Basic ${encoded}`)
    request.set('X-Session-Id', userId)
    const { body } = await request
    return body as CaseDetails
  }

  async isActiveUser({ userEmail, userId }: GetEmailRequestOptions): Promise<boolean> {
    try {
      const url = `${this.baseUrl}/api/cases/active-user`
      const request = superagent.get(url)
      const encoded = Buffer.from(userEmail).toString('base64')
      request.set('Authorization', `Basic ${encoded}`)
      request.set('X-Session-Id', userId)

      await request
      return true
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
      return false
    }
  }
}
