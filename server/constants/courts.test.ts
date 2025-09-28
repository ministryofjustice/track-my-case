import courts from './courts'

describe('courts', () => {
  it('test all courts has URL', async () => {
    const found = new Map<string, string>()
    const notFound = new Set<string>()
    const singleCityMatch = new Map<string, string>()
    const multiCityMatch = new Map<string, Map<string, string>>()
    const extraMapping = new Map<string, string>()

    const allCourts = courts.getAllCourts()
    const courtsMap = courts.getCourtsMap()
    for (const court of allCourts) {
      const courtUrl = courts.getCourtUrl(court)
      if (courtUrl) {
        found.set(court, courtUrl)
      } else {
        const courtCity = court.split(' ')[0]
        const filteredCourts: Map<string, string> = new Map(
          Array.from(courtsMap.entries()).filter(([entry]) => entry.toLowerCase().startsWith(courtCity.toLowerCase())),
        )
        if (filteredCourts.size > 0) {
          if (filteredCourts.size === 1) {
            const matchedCourt = Array.from(filteredCourts.keys())[0]
            extraMapping.set(court, matchedCourt)
            const matchedCourtUrl = filteredCourts.get(matchedCourt)
            found.set(court, matchedCourtUrl)
            singleCityMatch.set(court, matchedCourtUrl)
          } else {
            multiCityMatch.set(court, filteredCourts)
            notFound.add(court)
          }
        } else {
          notFound.add(court)
        }
      }
    }
    // const mappingStrings: string[] = Array.from(extraMapping.entries()).map(
    //   ([key, value]) => `["${key}", "${value}"]`
    // );
    // console.log(mappingStrings);
    // console.log('extraMapping:', extraMapping)
    // console.log('singleCityMatch:', singleCityMatch)
    // console.log('notFound:', notFound)
    // console.log('found: ', found)

    expect(extraMapping.size).toBe(0)
    expect(singleCityMatch.size).toBe(0)
    expect(multiCityMatch.size).toBe(0)

    const notFoundNumber = 3
    expect(notFound.size).toBe(notFoundNumber)
    expect(notFound.has("Banbury Magistrates' Court")).toBeTruthy() // Permanently closed
    expect(notFound.has('Blackfriars Crown Court')).toBeTruthy() // Permanently closed
    expect(notFound.has('Maidenhead Courthouse')).toBeTruthy() // Permanently closed

    expect(found.size).toBe(233 - notFoundNumber)
    expect(found.size).toBe(allCourts.size - notFoundNumber)

    const allCourtsInitially = new Set(courts.getAllCourts())
    notFound.forEach(court => allCourtsInitially.delete(court))

    allCourtsInitially.forEach(court => {
      if (!notFound.has(court)) {
        expect(!!courts.getCourtUrl(court)).toBeTruthy()
      }
    })
  })
})
