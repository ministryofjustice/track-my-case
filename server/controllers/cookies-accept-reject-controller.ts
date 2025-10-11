import { NextFunction, Request, Response } from 'express'

const cookiesAcceptRejectController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const cookieAccepted = req.body?.cookieAccepted
    const cookieAcceptedOptions = ['accepted', 'rejected']
    if (cookieAcceptedOptions.includes(cookieAccepted)) {
      req.session.cookieAccepted = cookieAccepted
      res.status(204).end()
    } else {
      console.error('Unsupported cookie banner action', cookieAccepted)
      res.status(404).end()
    }
  } catch (error) {
    next(error)
  }
}

export default cookiesAcceptRejectController
