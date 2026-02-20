import { NextFunction, Request, Response } from 'express'
import { pageFeedbackTotal } from '../services/prometheusService'

const MAX_PAGE_LABEL_LENGTH = 200

const feedbackDecisionController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const pageUsefulYesNo = req.body?.pageUseful?.toLowerCase() === 'yes' ? 'Yes' : 'No'
    const pageUrl = req.body?.pageUrl
    const pageTitle = req.body?.pageTitle
    const pageLabel = toPageLabel(pageTitle, pageUrl)

    pageFeedbackTotal.inc({ page: pageLabel, useful: pageUsefulYesNo })

    res.sendStatus(204)
  } catch (err) {
    next(err)
  }
}

const toPageLabel = (title: string, url: string | undefined): string => {
  const pageLabel = `${title?.trim()} (${url?.trim()})`
  return pageLabel.length > MAX_PAGE_LABEL_LENGTH ? `${pageLabel.slice(0, MAX_PAGE_LABEL_LENGTH - 3)}...` : pageLabel
}

export default feedbackDecisionController
