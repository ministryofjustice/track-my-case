import { Request } from 'express'
import crypto from 'crypto'

const properCase = (word: string): string =>
  word.length >= 1 ? word[0].toUpperCase() + word.toLowerCase().slice(1) : word

const isBlank = (str: string): boolean => !str || /^\s*$/.test(str)

/**
 * Converts a name (first name, last name, middle name, etc.) to proper case equivalent, handling double-barreled names
 * correctly (i.e. each part in a double-barreled is converted to proper case).
 * @param name name to be converted.
 * @returns name converted to proper case.
 */
const properCaseName = (name: string): string => (isBlank(name) ? '' : name.split('-').map(properCase).join('-'))

export const convertToTitleCase = (sentence: string): string =>
  isBlank(sentence) ? '' : sentence.split(' ').map(properCaseName).join(' ')

export const initialiseName = (fullName?: string): string | null => {
  // this check is for the authError page
  if (!fullName) return null

  const array = fullName.split(' ')
  return `${array[0][0]}. ${array.reverse()[0]}`
}

export const isAuthenticatedRequest = (req: Request) => req.isAuthenticated && req.isAuthenticated()

export const toBoolean = (value: string | boolean | number | undefined | null): boolean => {
  const falseValues = [undefined, 'undefined', null, 'null', '', 0, '0', false, 'false']
  if (falseValues.includes(value)) {
    return false
  }
  const trueValues = [true, 'true', '"true"', 1, '1']
  if (trueValues.includes(value)) {
    return true
  }
  if (typeof value === 'string' && trueValues.includes(value.toLowerCase())) {
    return true
  }
  return false
}

export const encryptValue = (data: string, secret: string): string => {
  if (data) {
    return crypto
      .createHmac('sha256', Buffer.from(secret, 'utf8'))
      .update('tmc:v1', 'utf8')
      .update('\x1f')
      .update(data, 'utf8')
      .digest()
      .toString('base64url')
  }
  return undefined
}

/**
 * Replace colon-prefixed path parameters with actual values.
 *
 * Example:
 *   resolvePath('/case/:urn/casedetails', { urn: '12345' })
 *   → ''/case/12345/casedetails''
 */
export const resolvePath = (template: string, params: Record<string, string | number>): string =>
  Object.entries(params).reduce(
    (path, [key, value]) => path.replace(`:${key}`, encodeURIComponent(String(value))),
    template,
  )
