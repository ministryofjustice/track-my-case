import { NextFunction, Request, Response } from 'express'
import { initialiseBasicAuthentication } from '../helpers/initialise-basic-authentication'
import paths from '../constants/paths'
import { CaseConfirmFormData } from '../interfaces/formSchemas'
import { FormState } from '../interfaces/formState'

const confirmCaseController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    await initialiseBasicAuthentication(req, res, next)

    res.locals.pageTitle = 'Confirm Case URN'
    res.locals.backLink = '/case/search'
    res.locals.selectedUrn = req.session.selectedUrn

    res.locals.radioItems = [
      {
        value: 'yes',
        text: 'Yes',
        checked: false,
      },
      {
        value: 'no',
        text: 'No, search again',
        checked: false,
      },
    ]

    const formState: FormState<CaseConfirmFormData> = req.session.formState?.confirmCase
    res.locals.caseConfirmed = formState?.formData?.caseConfirmed || req.session?.selectedCrn
    res.locals.errorList = formState?.errors
    res.locals.csrfToken = req.csrfToken()

    if (res.locals.selectedUrn) {
      res.render('pages/case/confirm-case.njk')
    } else {
      res.redirect(paths.CASES.SEARCH)
    }
  } catch (error) {
    next(error)
  }
}

const postConfirmCase = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { caseConfirmed } = req.body as CaseConfirmFormData

    if (caseConfirmed === 'yes') {
      delete req.session.formState?.confirmCase
      req.session.caseConfirmed = true
      return res.redirect(paths.CASES.COURT_INFORMATION)
    }
    if (caseConfirmed === 'no') {
      delete req.session.formState?.confirmCase
      req.session.caseConfirmed = false
      return res.redirect(paths.CASES.SEARCH)
    }
    const formState: FormState<CaseConfirmFormData> = {
      errors: [{ text: 'Please confirm selected case', href: '#caseConfirmed' }],
      formData: { caseConfirmed },
    }

    req.session.formState = req.session.formState || {}
    req.session.formState.confirmCase = formState

    return res.redirect(paths.CASES.CONFIRM_CASE)
  } catch (error) {
    return next(error)
  }
}

export { confirmCaseController, postConfirmCase }
