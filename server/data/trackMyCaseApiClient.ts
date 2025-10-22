import superagent from 'superagent'
import config from '../config'
import { CaseDetails, ServiceHealth } from '../interfaces/caseDetails'

export type GetHealthRequestOptions = {
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

  async getHealth({ path }: GetHealthRequestOptions): Promise<ServiceHealth> {
    const url = `${this.baseUrl}${path}`
    const { body } = await superagent.get(url)
    return body as ServiceHealth
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
    } catch (e) {
      return false
    }
  }
}
