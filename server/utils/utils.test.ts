import { convertToTitleCase, getSafeReturnPath, initialiseName, resolvePath, toBoolean } from './utils'
import paths from '../constants/paths'

describe('convert to title case', () => {
  it.each([
    [null, null, ''],
    ['empty string', '', ''],
    ['Lower case', 'robert', 'Robert'],
    ['Upper case', 'ROBERT', 'Robert'],
    ['Mixed case', 'RoBErT', 'Robert'],
    ['Multiple words', 'RobeRT SMiTH', 'Robert Smith'],
    ['Leading spaces', '  RobeRT', '  Robert'],
    ['Trailing spaces', 'RobeRT  ', 'Robert  '],
    ['Hyphenated', 'Robert-John SmiTH-jONes-WILSON', 'Robert-John Smith-Jones-Wilson'],
  ])('%s convertToTitleCase(%s, %s)', (_: string, a: string, expected: string) => {
    expect(convertToTitleCase(a)).toEqual(expected)
  })
})

describe('initialise name', () => {
  it.each([
    [null, null, null],
    ['Empty string', '', null],
    ['One word', 'robert', 'r. robert'],
    ['Two words', 'Robert James', 'R. James'],
    ['Three words', 'Robert James Smith', 'R. Smith'],
    ['Double barrelled', 'Robert-John Smith-Jones-Wilson', 'R. Smith-Jones-Wilson'],
  ])('%s initialiseName(%s, %s)', (_: string, a: string, expected: string) => {
    expect(initialiseName(a)).toEqual(expected)
  })
})

describe('toBoolean', () => {
  it('to be true', async () => {
    expect(toBoolean(true)).toBe(true)
    expect(toBoolean('true')).toBe(true)
    expect(toBoolean('True')).toBe(true)
    expect(toBoolean('TRUE')).toBe(true)
    expect(toBoolean('"TRUE"')).toBe(true)
    expect(toBoolean('1')).toBe(true)
    expect(toBoolean(1)).toBe(true)
    expect(toBoolean(1.0)).toBe(true)
  })

  it('to be false', async () => {
    expect(toBoolean(undefined)).toBe(false)
    expect(toBoolean(null)).toBe(false)
    expect(toBoolean('')).toBe(false)
    expect(toBoolean(false)).toBe(false)
    expect(toBoolean('false')).toBe(false)
    expect(toBoolean('False')).toBe(false)
    expect(toBoolean('FALSE')).toBe(false)
    expect(toBoolean('"FALSE"')).toBe(false)
    expect(toBoolean(0)).toBe(false)
    expect(toBoolean('0')).toBe(false)
    expect(toBoolean('yes')).toBe(false)
    expect(toBoolean('no')).toBe(false)
    expect(toBoolean('1.0')).toBe(false)
    expect(toBoolean('2')).toBe(false)
    expect(toBoolean(2)).toBe(false)
  })
})

describe('resolvePath', () => {
  it('replaces a single path param', () => {
    const result = resolvePath('/api/cases/:urn/casedetails', { urn: 'abc123' })
    expect(result).toBe('/api/cases/abc123/casedetails')
  })

  it('replaces multiple params', () => {
    const result = resolvePath('/users/:userId/orders/:orderId', {
      userId: 'u1',
      orderId: 'o2',
    })
    expect(result).toBe('/users/u1/orders/o2')
  })

  it('encodes values safely', () => {
    const result = resolvePath('/search/:query', { query: 'A&B/C' })
    expect(result).toBe('/search/A%26B%2FC')
  })
})

describe('getSafeReturnPath', () => {
  const fallback = paths.CASES.DASHBOARD

  it('returns fallback for undefined, null, empty', () => {
    expect(getSafeReturnPath(undefined, fallback)).toBe(fallback)
    expect(getSafeReturnPath(null, fallback)).toBe(fallback)
    expect(getSafeReturnPath('', fallback)).toBe(fallback)
    expect(getSafeReturnPath('   ', fallback)).toBe(fallback)
  })

  it('allows trusted paths from paths constant', () => {
    expect(getSafeReturnPath(paths.CASES.DASHBOARD, fallback)).toBe(paths.CASES.DASHBOARD)
    expect(getSafeReturnPath(paths.START, fallback)).toBe(paths.START)
    expect(getSafeReturnPath(paths.CASES.SEARCH, fallback)).toBe(paths.CASES.SEARCH)
    expect(getSafeReturnPath(paths.PRIVATE_BETA_SIGN_IN, fallback)).toBe(paths.PRIVATE_BETA_SIGN_IN)
  })

  it('strips query and hash; path must still be trusted', () => {
    expect(getSafeReturnPath(`${paths.CASES.DASHBOARD}?x=1`, fallback)).toBe(paths.CASES.DASHBOARD)
    expect(getSafeReturnPath(`${paths.CASES.DASHBOARD}#frag`, fallback)).toBe(paths.CASES.DASHBOARD)
  })

  it('do not allows /courthouses/:id pattern', () => {
    expect(getSafeReturnPath('/courthouses/birmingham-01', fallback)).toBe(paths.CASES.DASHBOARD)
  })

  it('rejects open redirects and traversal', () => {
    expect(getSafeReturnPath('//evil.com', fallback)).toBe(fallback)
    expect(getSafeReturnPath('/\\evil.com', fallback)).toBe(fallback)
    expect(getSafeReturnPath('https://evil.com', fallback)).toBe(fallback)
    expect(getSafeReturnPath('//evil.com/path', fallback)).toBe(fallback)
    expect(getSafeReturnPath('/case/../admin', fallback)).toBe(fallback)
    expect(getSafeReturnPath('/case/./dashboard', fallback)).toBe(fallback)
    // eslint-disable-next-line no-script-url
    expect(getSafeReturnPath('javascript:alert(1)', fallback)).toBe(fallback)
    expect(getSafeReturnPath('/not-a-real-app-route', fallback)).toBe(fallback)
    expect(getSafeReturnPath('@evil', fallback)).toBe(fallback)
    expect(getSafeReturnPath('/user@evil.com', fallback)).toBe(fallback)
  })

  it('rejects encoded traversal', () => {
    expect(getSafeReturnPath('/case/%2e%2e%2fetc', fallback)).toBe(fallback)
  })
})
