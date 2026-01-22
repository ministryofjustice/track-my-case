import CourtHearingService from './courtHearingService'
import TrackMyCaseApiClient from '../data/trackMyCaseApiClient'
import { logger } from '../logger'
import { CaseDetailsResponse } from '../interfaces/caseDetails'
import { getMockCaseDetailsResponse } from './mock/mock-response'

describe('CourtHearingService', () => {
  let mockGetCaseDetailsByUrn: jest.Mock
  let service: CourtHearingService

  class MockTrackMyCaseApiClient extends TrackMyCaseApiClient {
    getCaseDetailsByUrn = jest.fn()
  }

  beforeAll(() => {
    jest.spyOn(logger, 'debug').mockImplementation(jest.fn())
  })

  beforeEach(() => {
    jest.clearAllMocks()
    const mockClient = new MockTrackMyCaseApiClient()
    mockGetCaseDetailsByUrn = mockClient.getCaseDetailsByUrn
    service = new CourtHearingService(mockClient as unknown as TrackMyCaseApiClient)
  })

  it('calls getCaseDetailsByUrn', async () => {
    const urn = 'CASE123'
    const userEmail = 'example@email.com'
    const caseDetailsResponse: CaseDetailsResponse = getMockCaseDetailsResponse()

    mockGetCaseDetailsByUrn.mockResolvedValue(caseDetailsResponse.caseDetails)

    const result = await service.getCaseDetailsByUrn(urn, userEmail)

    expect(mockGetCaseDetailsByUrn).toHaveBeenCalledWith({
      path: `/api/cases/${urn}/casedetails`,
      userEmail,
    })
    expect(result).toEqual(caseDetailsResponse)
  })
})
