import { convertToTitleCase, initialiseName, toBoolean } from './utils'

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
  })
})
