import { NextFunction, Request, Response } from 'express'
import { initialiseBasicAuthentication } from '../helpers/initialise-basic-authentication'
import { CookiesSelecteFormData } from '../interfaces/formSchemas'
import { FormError, FormState } from '../interfaces/formState'
import paths from '../constants/paths'

interface CookiesPolicy {
  essential: boolean
}

const cookieAcceptedOptions = ['accepted', 'rejected']

const saveCookies = (cookieAccepted: string | undefined, res: Response) => {
  if (cookieAcceptedOptions.includes(cookieAccepted)) {
    res.locals.cookieAccepted = cookieAccepted

    const policy: CookiesPolicy = {
      essential: cookieAccepted === 'accepted',
    }

    res.cookie('cookies_preferences_set', cookieAccepted, { signed: true })
    res.cookie('cookies_policy', JSON.stringify(policy), { signed: true })

    return true
  }
  return false
}

export const cookiesAcceptRejectController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const cookieAccepted = req.body?.cookieAccepted?.toLowerCase()

    const cookiesSaved: boolean = saveCookies(cookieAccepted, res)
    if (cookiesSaved) {
      res.sendStatus(204)
    } else {
      // eslint-disable-next-line no-console
      console.error('Unsupported cookie banner action', cookieAccepted)
      res.sendStatus(404)
    }
  } catch (error) {
    next(error)
  }
}

export const getCookiesController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    await initialiseBasicAuthentication(req, res, next)

    res.locals.pageTitle = 'Cookies'

    if (res.locals.authenticated) {
      if (req.headers?.referer && new URL(req.headers?.referer)?.pathname === paths.START) {
        res.locals.backLink = paths.START
      } else {
        res.locals.backLink = paths.CASES.DASHBOARD
      }
    } else {
      res.locals.backLink = paths.START
    }

    if (res.locals.cookieAccepted) {
      delete req.session.formState?.cookiesSelect
    } else if (req.session.formState?.cookiesSelect) {
      res.locals.errorList = req.session.formState?.cookiesSelect?.errors
    }

    res.render('pages/cookies.njk')
  } catch (error) {
    next(error)
  }
}

export const postCookiesController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { cookiePreferenceAnalytics } = req.body as CookiesSelecteFormData

    const formErrors = validationRules(cookiePreferenceAnalytics)

    if (!formErrors.length) {
      const cookiesSaved = saveCookies(cookiePreferenceAnalytics, res)
      if (!cookiesSaved) {
        formErrors.push({
          text: `Error while saving cookies`,
          href: '#cookiePreferenceAnalytics',
        })
      }
    }

    if (formErrors.length > 0) {
      const formState: FormState<CookiesSelecteFormData> = {
        errors: formErrors,
        formData: { cookiePreferenceAnalytics },
      }

      req.session.formState = req.session.formState || {}
      req.session.formState.cookiesSelect = formState

      return res.redirect(paths.COOKIES)
    }

    delete req.session.formState?.cookiesSelect

    return res.redirect(paths.COOKIES)
  } catch (error) {
    return next(error)
  }
}

const validationRules = (cookiePreferenceAnalytics: string): FormError[] => {
  const errors: FormError[] = []

  if (!cookiePreferenceAnalytics || !cookiePreferenceAnalytics.trim().length) {
    errors.push({ text: 'Enter accept or reject analytics cookies', href: '#cookiePreferenceAnalytics' })
  } else if (!cookieAcceptedOptions.includes(cookiePreferenceAnalytics)) {
    errors.push({
      text: `Analytics cookies value  ${cookiePreferenceAnalytics} does not match accepted or rejected`,
      href: '#cookiePreferenceAnalytics',
    })
  }

  return errors
}
