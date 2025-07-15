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

    const formState = req.session.formState?.caseSelect
    const errorList = formState?.errors

    res.locals.pageTitle = 'Enter unique reference number (URN)'

    res.render('pages/case/enter-unique-reference-number.njk', {
      errorList,
      csrfToken: req.csrfToken(),
    })

    delete req.session.formState?.caseSelect
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
        errors: [{ text: 'Enter unique reference number (URN)', href: '#selectedUrn' }],
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
