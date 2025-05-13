import CourtHearingService from './courtHearingService'
import TrackMyCaseApiClient from '../data/trackMyCaseApiClient'
import { CourtSchedule } from '../interfaces/caseHearing'
import paths from '../constants/paths'
import logger from '../../logger'

describe('CourtHearingService', () => {
  let mockGet: jest.Mock
  let service: CourtHearingService

  class MockTrackMyCaseApiClient {
    get = jest.fn()
  }

  beforeAll(() => {
    jest.spyOn(logger, 'debug').mockImplementation(jest.fn())
  })

  beforeEach(() => {
    jest.clearAllMocks()
    const mockClient = new MockTrackMyCaseApiClient()
    mockGet = mockClient.get
    service = new CourtHearingService(mockClient as unknown as TrackMyCaseApiClient)
  })

  it('calls getHearings with resolved path', async () => {
    const caseId = 'CASE123'
    const mockResponse: CourtSchedule = {
      hearings: [],
      courtHouse: {
        courtHouse: '1',
        courtHouseType: 'Magistrates',
        courtHouseCode: 'MAG1',
        courtHouseName: 'Test Court',
        courtHouseDescription: 'A court for testing.',
        courtRoom: [],
      },
    }

    mockGet.mockResolvedValue(mockResponse)

    const result = await service.getHearings(caseId)

    expect(mockGet).toHaveBeenCalledWith({
      path: `/cases/${caseId}/hearings`,
    })
    expect(result).toEqual(mockResponse)
  })

  it('calls getCourtInformation with default caseId and logs the response', async () => {
    const mockResponse: CourtSchedule[] = [
      {
        hearings: [],
        courtHouse: {
          courtHouse: '1',
          courtHouseType: 'Crown',
          courtHouseCode: 'CRN1',
          courtHouseName: 'Default Court',
          courtHouseDescription: 'Default case court.',
          courtRoom: [],
        },
      },
    ]

    mockGet.mockResolvedValue(mockResponse)

    const result = await service.getCourtInformation()

    expect(mockGet).toHaveBeenCalledWith({
      path: paths.CASES.INFO.replace(':caseId', '12345'),
    })
    expect(result).toEqual(mockResponse)
    expect(logger.debug).toHaveBeenCalledWith('CourtHearingService.getCourtInformation: successful response', {
      courtSchedule: mockResponse,
    })
  })
})
