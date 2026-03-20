import { NextFunction, Request, Response } from 'express'
import paths from '../constants/paths'
import { PASSWORD_CORRECT } from '../constants/cookiesUtils'
import { postPrivateBetaSignInController, privateBetaSignInController } from './private-beta-sign-in-controller'

const mockInitialiseBasicAuthentication = jest.fn().mockResolvedValue(undefined)
jest.mock('../helpers/initialise-basic-authentication', () => ({
  initialiseBasicAuthentication: (...args: unknown[]) => mockInitialiseBasicAuthentication(...args),
}))

jest.mock('../config', () => ({
  __esModule: true,
  default: {
    settings: {
      password: 'correct-secret;other-secret',
      passwordExpirationInMinutes: 120,
    },
    https: false,
  },
}))

describe('privateBetaSignInController (GET)', () => {
  const createReqRes = (session?: Partial<Request['session']>) => {
    const req = {
      session: {
        formState: {},
        ...session,
      },
    } as unknown as Request
    const res = {
      locals: {} as Record<string, unknown>,
      render: jest.fn(),
    } as unknown as Response
    const next = jest.fn() as NextFunction
    return { req, res, next }
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('calls initialiseBasicAuthentication and renders private-beta page', async () => {
    const { req, res, next } = createReqRes()
    await privateBetaSignInController(req, res, next)

    expect(mockInitialiseBasicAuthentication).toHaveBeenCalledWith(req, res, next)
    expect(res.locals.pageTitle).toBe('Enter service password')
    expect(res.locals.privateBetaSignInApi).toBe(paths.PRIVATE_BETA_SIGN_IN)
    expect(res.render).toHaveBeenCalledWith('pages/private-beta-sign-in.njk')
  })

  it('exposes errorList from session and clears privateBetaSignIn form state', async () => {
    const { req, res, next } = createReqRes({
      formState: {
        privateBetaSignIn: {
          errors: [{ text: 'Enter a password', href: '#password' }],
          formData: { password: '' },
        },
      },
    })

    await privateBetaSignInController(req, res, next)

    expect(res.locals.errorList).toEqual([{ text: 'Enter a password', href: '#password' }])
    expect(req.session.formState?.privateBetaSignIn).toBeUndefined()
  })

  it('calls next on error', async () => {
    const { req, res, next } = createReqRes()
    const err = new Error('fail')
    mockInitialiseBasicAuthentication.mockRejectedValueOnce(err)

    await privateBetaSignInController(req, res, next)

    expect(next).toHaveBeenCalledWith(err)
  })
})

describe('postPrivateBetaSignInController', () => {
  const createReqRes = (body: Record<string, unknown>, session?: Record<string, unknown>) => {
    const req = {
      body,
      session: {
        formState: {},
        ...session,
      },
    } as unknown as Request
    const res = {
      cookie: jest.fn(),
      clearCookie: jest.fn(),
      redirect: jest.fn(),
      locals: {} as Record<string, unknown>,
    } as unknown as Response
    const next = jest.fn() as NextFunction
    return { req, res, next }
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('redirects to sign-in with validation errors when password is empty', async () => {
    const { req, res, next } = createReqRes({ password: '' })

    await postPrivateBetaSignInController(req, res, next)

    expect(req.session.formState?.privateBetaSignIn?.errors).toEqual([{ text: 'Enter a password', href: '#password' }])
    expect(res.redirect).toHaveBeenCalledWith(paths.PRIVATE_BETA_SIGN_IN)
    expect(res.cookie).not.toHaveBeenCalled()
  })

  it('sets signed cookie and redirects when password matches config', async () => {
    const { req, res, next } = createReqRes({ password: 'correct-secret' }, { returnTo: paths.CASES.SEARCH })

    await postPrivateBetaSignInController(req, res, next)

    expect(res.cookie).toHaveBeenCalledWith(
      PASSWORD_CORRECT,
      true,
      expect.objectContaining({
        signed: true,
        maxAge: 120 * 60 * 1000,
        httpOnly: true,
        sameSite: 'lax',
        secure: false,
      }),
    )
    expect(res.redirect).toHaveBeenCalledWith(paths.CASES.SEARCH)
    expect(req.session.returnTo).toBeUndefined()
    expect(req.session.formState?.privateBetaSignIn).toBeUndefined()
  })

  it('redirects to dashboard when returnTo is missing', async () => {
    const { req, res, next } = createReqRes({ password: 'correct-secret' })

    await postPrivateBetaSignInController(req, res, next)

    expect(res.redirect).toHaveBeenCalledWith(paths.CASES.DASHBOARD)
  })

  it('stores wrong-password error and clears password cookie when password is invalid', async () => {
    const { req, res, next } = createReqRes({ password: 'wrong' })

    await postPrivateBetaSignInController(req, res, next)

    expect(res.cookie).not.toHaveBeenCalled()
    expect(res.clearCookie).toHaveBeenCalledWith(PASSWORD_CORRECT)
    expect(req.session.formState?.privateBetaSignIn?.errors).toEqual([
      { text: 'The password you entered is not correct', href: '#password' },
    ])
    expect(res.redirect).toHaveBeenCalledWith(paths.PRIVATE_BETA_SIGN_IN)
  })

  it('calls next when redirect throws', async () => {
    const { req, res, next } = createReqRes({ password: 'correct-secret' })
    ;(res.redirect as jest.Mock).mockImplementation(() => {
      throw new Error('redirect failed')
    })

    await postPrivateBetaSignInController(req, res, next)

    expect(next).toHaveBeenCalledWith(expect.any(Error))
  })
})
