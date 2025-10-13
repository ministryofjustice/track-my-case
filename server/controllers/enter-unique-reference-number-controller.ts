import { NextFunction, Request, Response } from 'express'
import { CaseReferenceNumberFormData } from '../interfaces/formSchemas'
import { FormError, FormState } from '../interfaces/formState'
import { initialiseBasicAuthentication } from '../helpers/initialise-basic-authentication'
import paths from '../constants/paths'
import TrackMyCaseApiClient from '../data/trackMyCaseApiClient'
import CourtHearingService from '../services/courtHearingService'
import { ServiceHealth } from '../interfaces/caseDetails'

const trackMyCaseApiClient = new TrackMyCaseApiClient()
const courtHearingService = new CourtHearingService(trackMyCaseApiClient)

const getEnterUniqueReferenceNumber = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    await initialiseBasicAuthentication(req, res, next)

    delete req.session.selectedUrn
    delete req.session.caseConfirmed

    const formState = req.session.formState?.caseSelect
    res.locals.errorList = formState?.errors
    delete req.session.formState?.caseSelect

    res.locals.pageTitle = 'Enter Unique Reference Number (URN)'
    res.locals.backLink = '/case/dashboard'
    res.locals.csrfToken = req.csrfToken()

    const serviceHealth: ServiceHealth = await courtHearingService.getServiceHealth()
    if (serviceHealth?.status?.toUpperCase() === 'UP') {
      res.render('pages/case/enter-unique-reference-number.njk')
    } else {
      res.locals.pageTitle = 'Enter Unique Reference Number (URN) - Service Error'
      res.render('pages/case/service-error.njk')
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (e) {
    res.locals.pageTitle = 'Enter Unique Reference Number (URN) - Service Error'
    res.render('pages/case/service-error.njk')
  }
}

const SELECTED_URN_PATTERN = /^[A-Za-z0-9]{1,11}$/

const validationRules = (selectedUrn: string): FormError[] => {
  const errors: FormError[] = []

  if (!selectedUrn || !selectedUrn.trim().length) {
    errors.push({ text: 'Enter Unique Reference Number (URN)', href: '#selectedUrn' })
  } else if (!SELECTED_URN_PATTERN.test(selectedUrn.trim())) {
    errors.push({ text: 'Enter a Unique Reference Number (URN) in the correct format', href: '#selectedUrn' })
  }

  return errors
}

const postEnterUniqueReferenceNumber = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { selectedUrn } = req.body as CaseReferenceNumberFormData

    const formErrors = validationRules(selectedUrn)

    if (formErrors.length > 0) {
      const formState: FormState<CaseReferenceNumberFormData> = {
        errors: formErrors,
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

export { getEnterUniqueReferenceNumber, postEnterUniqueReferenceNumber, SELECTED_URN_PATTERN }
