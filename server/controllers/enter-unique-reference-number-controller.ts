import { NextFunction, Request, Response } from 'express'
import { CaseReferenceNumberFormData } from '../interfaces/formSchemas'
import { FormError, FormState } from '../interfaces/formState'
import { initialiseBasicAuthentication } from '../helpers/initialise-basic-authentication'
import paths from '../constants/paths'
import TrackMyCaseApiClient from '../data/trackMyCaseApiClient'
import { ServiceHealth } from '../interfaces/caseDetails'
import HealthService from '../services/healthService'
import { UP } from '../constants/healthStatus'

const parseNowQueryParam = (value: string | undefined): Date | undefined => {
  /** Parse optional ?now= query param for testing; returns undefined if missing or invalid. */
  if (value == null || typeof value !== 'string' || !value.trim()) {
    return undefined
  }
  const trimmed = value.trim()
  try {
    const parsedDate = new Date(trimmed)
    if (Number.isNaN(parsedDate.getTime())) {
      // eslint-disable-next-line no-console
      console.error('Invalid date time format', trimmed)
    } else {
      return parsedDate
    }
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error('Invalid date time format', trimmed, e.message)
  }
  return undefined
}

const isWithinUpcomingMaintenanceWindow = (date: Date): boolean => {
  /**
   * True only when current time is in the maintenance window: Friday 12:00 - Saturday 18:00 (UK).
   * End time is exclusive (Saturday 18:00:00 is no longer in the window).
   */

  const day = date.getDay()
  const hours = date.getHours()
  const minutes = date.getMinutes()

  const time = hours + minutes / 60

  if (day === 5) {
    // 5 = Friday
    return time >= 12
  }

  if (day === 6) {
    // 6 = Saturday
    return time < 18
  }

  return false
}

const isWithinOngoingMaintenanceWindow = (date: Date): boolean => {
  /**
   * True only when current time is in the maintenance window: Saturday 18:00 - Sunday 13:00 (UK).
   * End time is exclusive (Sunday 13:00:00 is no longer in the window).
   */

  const day = date.getDay()
  const hours = date.getHours()
  const minutes = date.getMinutes()

  const time = hours + minutes / 60

  if (day === 6) {
    // 6 = Saturday
    return time >= 18
  }

  if (day === 0) {
    // 0 = Sunday
    return time < 13
  }

  return false
}

const trackMyCaseApiClient = new TrackMyCaseApiClient()
const healthService = new HealthService(trackMyCaseApiClient)

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
    res.locals.backLink = paths.CASES.DASHBOARD

    const dateTimeNow = parseNowQueryParam(req.query?.now as string | undefined) ?? new Date()
    res.locals.ongoingMaintenance = isWithinOngoingMaintenanceWindow(dateTimeNow)
    res.locals.upcomingMaintenance = !res.locals.ongoingMaintenance && isWithinUpcomingMaintenanceWindow(dateTimeNow)

    const serviceHealth: ServiceHealth = await healthService.getServiceHealth()
    if (serviceHealth.status === UP) {
      res.render('pages/case/enter-unique-reference-number.njk')
    } else {
      res.locals.pageTitle = 'Service unavailable'
      res.render('pages/case/service-error.njk')
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (e) {
    res.locals.pageTitle = 'Service unavailable'
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

export {
  getEnterUniqueReferenceNumber,
  isWithinUpcomingMaintenanceWindow,
  isWithinOngoingMaintenanceWindow,
  parseNowQueryParam,
  postEnterUniqueReferenceNumber,
  SELECTED_URN_PATTERN,
}
