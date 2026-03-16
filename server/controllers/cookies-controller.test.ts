import { NextFunction, Request, Response } from 'express'
import paths from '../constants/paths'
import { cookiesAcceptRejectController, getCookiesController, postCookiesController } from './cookies-controller'

const mockInitialiseBasicAuthentication = jest.fn().mockResolvedValue(undefined)
jest.mock('../helpers/initialise-basic-authentication', () => ({
  initialiseBasicAuthentication: (...args: unknown[]) => mockInitialiseBasicAuthentication(...args),
}))

const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => undefined)

describe('cookies-controller', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  afterAll(() => {
    consoleErrorSpy.mockRestore()
  })

  describe('cookiesAcceptRejectController', () => {
    const createReqRes = (body?: { cookieAccepted?: string }) => {
      const req = { body: body ?? {} } as Request
      const res = {
        locals: {} as Record<string, unknown>,
        cookie: jest.fn(),
        sendStatus: jest.fn(),
      } as unknown as Response
      const next = jest.fn() as NextFunction
      return { req, res, next }
    }

    it('sends 204 and sets cookies when cookieAccepted is accepted', async () => {
      const { req, res, next } = createReqRes({ cookieAccepted: 'accepted' })
      await cookiesAcceptRejectController(req, res, next)
      expect(res.locals.cookieAccepted).toBe('accepted')
      expect(res.cookie).toHaveBeenCalledWith('cookies_preferences_set', 'accepted', { signed: true })
      expect(res.cookie).toHaveBeenCalledWith('cookies_policy', JSON.stringify({ essential: true }), {
        signed: true,
      })
      expect(res.sendStatus).toHaveBeenCalledWith(204)
    })

    it('sends 204 and sets cookies when cookieAccepted is rejected', async () => {
      const { req, res, next } = createReqRes({ cookieAccepted: 'rejected' })
      await cookiesAcceptRejectController(req, res, next)
      expect(res.locals.cookieAccepted).toBe('rejected')
      expect(res.cookie).toHaveBeenCalledWith('cookies_policy', JSON.stringify({ essential: false }), {
        signed: true,
      })
      expect(res.sendStatus).toHaveBeenCalledWith(204)
    })

    it('accepts case-insensitive value (ACCEPTED -> accepted)', async () => {
      const { req, res, next } = createReqRes({ cookieAccepted: 'ACCEPTED' })
      await cookiesAcceptRejectController(req, res, next)
      expect(res.sendStatus).toHaveBeenCalledWith(204)
    })

    it('sends 404 when cookieAccepted is unsupported', async () => {
      const { req, res, next } = createReqRes({ cookieAccepted: 'maybe' })
      await cookiesAcceptRejectController(req, res, next)
      expect(res.sendStatus).toHaveBeenCalledWith(404)
    })

    it('sends 404 when cookieAccepted is missing', async () => {
      const { req, res, next } = createReqRes()
      await cookiesAcceptRejectController(req, res, next)
      expect(res.sendStatus).toHaveBeenCalledWith(404)
    })

    it('calls next(error) when an error is thrown', async () => {
      const { req, res, next } = createReqRes({ cookieAccepted: 'accepted' })
      res.cookie = jest.fn().mockImplementation(() => {
        throw new Error('Cookie failed')
      })
      await cookiesAcceptRejectController(req, res, next)
      expect(next).toHaveBeenCalledWith(expect.any(Error))
    })
  })

  describe('getCookiesController', () => {
    const createReqRes = (overrides?: {
      authenticated?: boolean
      referer?: string
      cookieAccepted?: string
      session?: Request['session']
    }) => {
      const req = {
        headers: { referer: overrides?.referer },
        session: overrides?.session ?? {},
      } as Request
      const res = {
        locals: {
          authenticated: overrides?.authenticated ?? false,
          cookieAccepted: overrides?.cookieAccepted,
        } as Record<string, unknown>,
        render: jest.fn(),
      } as unknown as Response
      const next = jest.fn() as NextFunction
      return { req, res, next }
    }

    it('calls initialiseBasicAuthentication and renders cookies page', async () => {
      const { req, res, next } = createReqRes()
      await getCookiesController(req, res, next)
      expect(mockInitialiseBasicAuthentication).toHaveBeenCalledWith(req, res, next)
      expect(res.locals.pageTitle).toBe('Cookies')
      expect(res.render).toHaveBeenCalledWith('pages/cookies.njk')
    })

    it('sets backLink to START when not authenticated', async () => {
      const { req, res, next } = createReqRes({ authenticated: false })
      await getCookiesController(req, res, next)
      expect(res.locals.backLink).toBe(paths.START)
    })

    it('sets backLink to START when authenticated and referer is START', async () => {
      const { req, res, next } = createReqRes({
        authenticated: true,
        referer: `http://localhost${paths.START}`,
      })
      await getCookiesController(req, res, next)
      expect(res.locals.backLink).toBe(paths.START)
    })

    it('sets backLink to DASHBOARD when authenticated and referer is not START', async () => {
      const { req, res, next } = createReqRes({
        authenticated: true,
        referer: 'http://localhost/case/dashboard',
      })
      await getCookiesController(req, res, next)
      expect(res.locals.backLink).toBe(paths.CASES.DASHBOARD)
    })

    it('deletes session formState.cookiesSelect when cookieAccepted is set', async () => {
      const session = { formState: { cookiesSelect: { errors: [] } } }
      const { req, res, next } = createReqRes({ cookieAccepted: 'accepted', session })
      await getCookiesController(req, res, next)
      expect(req.session.formState?.cookiesSelect).toBeUndefined()
    })

    it('sets errorList from session when cookieAccepted not set and formState exists', async () => {
      const errors = [{ text: 'Enter accept or reject', href: '#cookiePreferenceAnalytics' }]
      const { req, res, next } = createReqRes({
        session: { formState: { cookiesSelect: { errors } } },
      })
      await getCookiesController(req, res, next)
      expect(res.locals.errorList).toEqual(errors)
    })

    it('calls next(error) when an error is thrown', async () => {
      const { req, res, next } = createReqRes()
      mockInitialiseBasicAuthentication.mockRejectedValue(new Error('Auth failed'))
      await getCookiesController(req, res, next)
      expect(next).toHaveBeenCalledWith(expect.any(Error))
    })
  })

  describe('postCookiesController', () => {
    const createReqRes = (body: { cookiePreferenceAnalytics?: string }) => {
      const req = {
        body,
        session: {} as Request['session'],
      } as Request
      const res = {
        locals: {} as Record<string, unknown>,
        cookie: jest.fn(),
        redirect: jest.fn(),
      } as unknown as Response
      const next = jest.fn() as NextFunction
      return { req, res, next }
    }

    it('saves cookies and redirects to COOKIES when value is accepted', async () => {
      const { req, res, next } = createReqRes({ cookiePreferenceAnalytics: 'accepted' })
      await postCookiesController(req, res, next)
      expect(res.cookie).toHaveBeenCalled()
      expect(req.session.formState?.cookiesSelect).toBeUndefined()
      expect(res.redirect).toHaveBeenCalledWith(paths.COOKIES)
    })

    it('saves cookies and redirects when value is rejected', async () => {
      const { req, res, next } = createReqRes({ cookiePreferenceAnalytics: 'rejected' })
      await postCookiesController(req, res, next)
      expect(res.redirect).toHaveBeenCalledWith(paths.COOKIES)
    })

    it('redirects with form state when cookiePreferenceAnalytics is empty', async () => {
      const { req, res, next } = createReqRes({ cookiePreferenceAnalytics: '' })
      await postCookiesController(req, res, next)
      expect(req.session.formState?.cookiesSelect?.errors).toEqual([
        { text: 'Enter accept or reject analytics cookies', href: '#cookiePreferenceAnalytics' },
      ])
      expect(res.redirect).toHaveBeenCalledWith(paths.COOKIES)
    })

    it('redirects with form state when value is invalid', async () => {
      const { req, res, next } = createReqRes({ cookiePreferenceAnalytics: 'invalid' })
      await postCookiesController(req, res, next)
      expect(req.session.formState?.cookiesSelect?.errors).toHaveLength(1)
      expect(req.session.formState?.cookiesSelect?.errors[0].text).toContain('does not match accepted or rejected')
      expect(res.redirect).toHaveBeenCalledWith(paths.COOKIES)
    })

    it('calls next(error) when an error is thrown', async () => {
      const { req, res, next } = createReqRes({ cookiePreferenceAnalytics: 'accepted' })
      res.cookie = jest.fn().mockImplementation(() => {
        throw new Error('Cookie failed')
      })
      await postCookiesController(req, res, next)
      expect(next).toHaveBeenCalledWith(expect.any(Error))
    })
  })
})
