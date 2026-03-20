import { NextFunction, Request, Response } from 'express'
import paths from '../constants/paths'
import { PASSWORD_CORRECT } from '../constants/cookiesUtils'
import { PasswordAuthenticated } from './authenticatedUser'

describe('PasswordAuthenticated', () => {
  const createRes = () =>
    ({
      redirect: jest.fn(),
    }) as unknown as Response

  const next = jest.fn() as NextFunction

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('calls next() when signed PASSWORD_CORRECT cookie is present', () => {
    const req = {
      signedCookies: { [PASSWORD_CORRECT]: '1' },
      session: {} as Request['session'],
    } as unknown as Request
    const res = createRes()

    PasswordAuthenticated(req, res, next)

    expect(next).toHaveBeenCalledTimes(1)
    expect(res.redirect).not.toHaveBeenCalled()
  })

  it('redirects to private beta sign-in and stores safe returnTo when cookie is missing', () => {
    const req = {
      signedCookies: {},
      originalUrl: paths.CASES.VICTIMS_JOURNEY,
      session: {} as Request['session'],
    } as unknown as Request
    const res = createRes()

    PasswordAuthenticated(req, res, next)

    expect(next).not.toHaveBeenCalled()
    expect(req.session.returnTo).toBe(paths.CASES.VICTIMS_JOURNEY)
    expect(res.redirect).toHaveBeenCalledWith(paths.PRIVATE_BETA_SIGN_IN)
  })

  it('stores dashboard as returnTo when originalUrl is not a trusted path', () => {
    const req = {
      signedCookies: {},
      originalUrl: '//evil.example/phish',
      session: {} as Request['session'],
    } as unknown as Request
    const res = createRes()

    PasswordAuthenticated(req, res, next)

    expect(req.session.returnTo).toBe(paths.CASES.DASHBOARD)
    expect(res.redirect).toHaveBeenCalledWith(paths.PRIVATE_BETA_SIGN_IN)
  })
})
