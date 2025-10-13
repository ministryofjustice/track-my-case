import { NextFunction, Request, Response } from 'express'

const cookiesAcceptRejectController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const cookieAccepted = req.body?.cookieAccepted
    const cookieAcceptedOptions = ['accepted', 'rejected']
    if (cookieAcceptedOptions.includes(cookieAccepted)) {
      req.session.cookieAccepted = cookieAccepted
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
