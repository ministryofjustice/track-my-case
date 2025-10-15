import CourtHearingService from './courtHearingService'
import TrackMyCaseApiClient from '../data/trackMyCaseApiClient'
import { logger } from '../logger'
import { CaseDetailsResponse, ServiceHealth } from '../interfaces/caseDetails'
import { getMockCaseDetailsResponse } from './mock/mock-response'

describe('CourtHearingService', () => {
  let mockGetHealth: jest.Mock
  let mockGetCaseDetailsByUrn: jest.Mock
  let service: CourtHearingService

  class MockTrackMyCaseApiClient extends TrackMyCaseApiClient {
    getHealth = jest.fn()

    getCaseDetailsByUrn = jest.fn()
  }

  beforeAll(() => {
    jest.spyOn(logger, 'debug').mockImplementation(jest.fn())
  })

  beforeEach(() => {
    jest.clearAllMocks()
    const mockClient = new MockTrackMyCaseApiClient()
    mockGetHealth = mockClient.getHealth
    mockGetCaseDetailsByUrn = mockClient.getCaseDetailsByUrn
    service = new CourtHearingService(mockClient as unknown as TrackMyCaseApiClient)
  })

  it('calls getServiceHealth', async () => {
    const mockResponse: ServiceHealth = {
      status: 'UP',
    }
    mockGetHealth.mockResolvedValue(mockResponse)

    const result = await service.getServiceHealth()

    expect(mockGetHealth).toHaveBeenCalledWith({
      path: '/health',
    })
    expect(result).toEqual(mockResponse)
  })

  it('calls getCaseDetailsByUrn', async () => {
    const urn = 'CASE123'
    const userEmail = 'example@email.com'
    const caseDetailsResponse: CaseDetailsResponse = getMockCaseDetailsResponse()

    mockGetCaseDetailsByUrn.mockResolvedValue(caseDetailsResponse.caseDetails)

    const result = await service.getCaseDetailsByUrn(urn, userEmail)

    expect(mockGetCaseDetailsByUrn).toHaveBeenCalledWith({
      path: `/case/${urn}/casedetails`,
      userEmail,
    })
    expect(result).toEqual(caseDetailsResponse)
  })
})
