import { getLngParam } from './languageUtils'

describe('getLngParam', () => {
  it('returns ?lng=cy for Welsh', () => {
    expect(getLngParam('cy')).toBe('?lng=cy')
  })

  it('returns empty string for English', () => {
    expect(getLngParam('en')).toBe('')
  })

  it('returns empty string for any other language', () => {
    expect(getLngParam('fr')).toBe('')
    expect(getLngParam('')).toBe('')
  })
})
