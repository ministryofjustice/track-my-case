import { Request, Response, NextFunction } from 'express'
import TrackMyCaseApiClient from '../data/trackMyCaseApiClient'
import CaseAssociationService from '../services/caseAsscociationService'

import { initialiseBasicAuthentication } from '../helpers/initialise-basic-authentication'
import { logger } from '../logger'

const caseSelectorController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    await initialiseBasicAuthentication(req, res, next)

    // const sub = req.user?.sub
    const sub = '2121212'
    if (!sub) {
      throw new Error('Missing user.sub – cannot fetch case associations')
    }

    const service = new CaseAssociationService(new TrackMyCaseApiClient())
    const associations = await service.getCaseAssociations(sub)

    res.locals.pageTitle = 'Select your case'
    res.locals.radioItems = associations.map(association => ({
      value: association.crn,
      text: `CRN ${association.crn} (${association.offence})`,
    }))

    res.render('pages/case/select.njk')
  } catch (error) {
    logger.error('caseSelectController: failed to load case associations', { error })
    next(error)
  }
}

export default caseSelectorController
