import { NextFunction, Request, Response } from 'express'

interface CookiesPolicy {
  essential: boolean
}

const cookiesAcceptRejectController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const cookieAccepted = req.body?.cookieAccepted?.toLowerCase()
    const cookieAcceptedOptions = ['accepted', 'rejected']
    if (cookieAcceptedOptions.includes(cookieAccepted)) {
      res.locals.cookieAccepted = cookieAccepted

      const policy: CookiesPolicy = {
        essential: cookieAccepted === 'accepted',
      }

      res.cookie('cookies_preferences_set', cookieAccepted, { signed: true })
      res.cookie('cookies_policy', JSON.stringify(policy), { signed: true })

      res.sendStatus(204)
    } else {
      // eslint-disable-next-line no-console
      console.error('Unsupported cookie banner action', cookieAccepted)
      res.sendStatus(404)
    }
  } catch (error) {
    next(error)
  }
}

export default cookiesAcceptRejectController
