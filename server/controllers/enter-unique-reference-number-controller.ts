import { NextFunction, Request, Response } from 'express'
import { CaseReferenceNumberFormData } from '../interfaces/formSchemas'
import { FormState } from '../interfaces/formState'
import { initialiseBasicAuthentication } from '../helpers/initialise-basic-authentication'
import { logger } from '../logger'
import paths from '../constants/paths'

const getEnterUniqueReferenceNumber = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    await initialiseBasicAuthentication(req, res, next)

    const userSub = res.locals.user?.sub || 'unknown'
    if (!userSub) {
      throw new Error('Missing user.sub – cannot fetch case associations')
    }

    delete req.session.selectedUrn
    delete req.session.caseConfirmed

    const formState = req.session.formState?.caseSelect
    res.locals.errorList = formState?.errors
    delete req.session.formState?.caseSelect

    res.locals.pageTitle = 'Enter Unique Reference Number (URN)'
    res.locals.backLink = '/case/dashboard'
    res.locals.csrfToken = req.csrfToken()

    res.render('pages/case/enter-unique-reference-number.njk')
  } catch (error) {
    logger.error('getCaseSelect: failed to load case associations', { error })
    next(error)
  }
}

const postEnterUniqueReferenceNumber = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { selectedUrn } = req.body as CaseReferenceNumberFormData

    if (!selectedUrn) {
      const formState: FormState<CaseReferenceNumberFormData> = {
        errors: [{ text: 'Enter Unique Reference Number (URN)', href: '#selectedUrn' }],
        formData: { selectedUrn },
      }

      req.session.formState = req.session.formState || {}
      req.session.formState.caseSelect = formState

      return res.redirect(paths.CASES.SEARCH)
    }

    req.session.selectedUrn = selectedUrn
    delete req.session.formState?.caseSelect

    return res.redirect(paths.CASES.CONFIRM_CASE)
  } catch (error) {
    return next(error)
  }
}

export { getEnterUniqueReferenceNumber, postEnterUniqueReferenceNumber }
