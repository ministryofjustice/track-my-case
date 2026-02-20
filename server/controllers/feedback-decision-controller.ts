import { NextFunction, Request, Response } from 'express'

const feedbackDecisionController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const pageUseful = req.body?.pageUseful?.toLowerCase() === 'yes'
    const pageUrl = req.body?.pageUrl
    const pageTitle = req.body?.pageTitle

    // eslint-disable-next-line no-console
    console.log('==>>> Is this page useful?', pageUseful, pageUrl, pageTitle)

    res.sendStatus(204)
  } catch (error) {
    next(error)
  }
}

export default feedbackDecisionController
