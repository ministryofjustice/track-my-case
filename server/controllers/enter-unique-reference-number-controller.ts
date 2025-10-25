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

    const formState = req.session.formState?.caseSelect
    res.locals.errorList = formState?.errors
    if (req.session.formState?.caseSelect?.formData?.selectedUrn) {
      res.locals.selectedUrn = req.session.formState?.caseSelect?.formData?.selectedUrn
    } else {
      delete res.locals.selectedUrn
    }

    res.locals.pageTitle = 'Find your court'
    res.locals.backLink = '/case/dashboard'
    res.locals.csrfToken = req.csrfToken()

    const serviceHealth: ServiceHealth = await courtHearingService.getServiceHealth()
    if (serviceHealth !== undefined) {
      res.render('pages/case/enter-unique-reference-number.njk')
    } else {
      res.locals.pageTitle = 'Enter your unique reference number - Service Error'
      res.render('pages/case/service-error.njk')
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (e) {
    res.locals.pageTitle = 'Enter your unique reference number - Service Error'
    res.render('pages/case/service-error.njk')
  }
}

const SELECTED_URN_PATTERN = /^[A-Za-z0-9]{1,11}$/

const validationRules = (selectedUrn: string): FormError[] => {
  const errors: FormError[] = []

  if (!selectedUrn || !selectedUrn.trim().length) {
    errors.push({ text: 'Enter your unique reference number', href: '#selectedUrn' })
  } else if (!SELECTED_URN_PATTERN.test(selectedUrn.trim())) {
    errors.push({ text: 'Enter your unique reference number in the correct format', href: '#selectedUrn' })
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

    return res.redirect(paths.CASES.COURT_INFORMATION)
  } catch (error) {
    return next(error)
  }
}

export { getEnterUniqueReferenceNumber, postEnterUniqueReferenceNumber, SELECTED_URN_PATTERN }
