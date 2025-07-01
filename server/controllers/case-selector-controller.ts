import { Request, Response, NextFunction } from 'express'
import TrackMyCaseApiClient from '../data/trackMyCaseApiClient'
import CaseAssociationService from '../services/caseAssociationService'

import { CaseSelectFormData } from '../interfaces/formSchemas'
import { FormState } from '../interfaces/formState'

import { initialiseBasicAuthentication } from '../helpers/initialise-basic-authentication'
import { logger } from '../logger'

const getCaseSelect = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    await initialiseBasicAuthentication(req, res, next)

    const userSub = res.locals.user?.sub
    if (!userSub) {
      throw new Error('Missing user.sub – cannot fetch case associations')
    }

    const service = new CaseAssociationService(new TrackMyCaseApiClient())
    const associations = await service.getCaseAssociations(userSub)

    const formState = req.session.formState?.caseSelect
    const selectedCrn = formState?.formData?.selectedCrn || req.session?.selectedCrn
    const errorList = formState?.errors

    const radioItems = associations.map(association => ({
      value: association.crn,
      text: `CRN ${association.crn} (${association.offence})`,
      checked: selectedCrn === association.crn,
    }))

    res.locals.pageTitle = 'Select your case'

    res.render('pages/case/select.njk', {
      radioItems,
      errorList,
      csrfToken: req.csrfToken(),
    })

    delete req.session.formState?.caseSelect
  } catch (error) {
    logger.error('getCaseSelect: failed to load case associations', { error })
    next(error)
  }
}

const postCaseSelect = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { selectedCrn } = req.body as CaseSelectFormData

    if (!selectedCrn) {
      const formState: FormState<CaseSelectFormData> = {
        errors: [{ text: 'Select a case to view', href: '#selectedCrn' }],
        formData: { selectedCrn },
      }

      req.session.formState = req.session.formState || {}
      req.session.formState.caseSelect = formState

      return res.redirect('/case/select')
    }

    req.session.selectedCrn = selectedCrn
    delete req.session.formState?.caseSelect

    return res.redirect('/case/dashboard')
  } catch (error) {
    return next(error)
  }
}

export { getCaseSelect, postCaseSelect }
