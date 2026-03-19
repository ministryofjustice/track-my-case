import { NextFunction, Request, Response } from 'express'
import { initialiseBasicAuthentication } from '../helpers/initialise-basic-authentication'
import paths from '../constants/paths'
import { PASSWORD_CORRECT, PASSWORD_EXPIRATION } from '../constants/cookiesUtils'
import config from '../config'
import { clearPasswordCookies } from '../utils/utils'
import { PrivateBetaSignInFormData } from '../interfaces/formSchemas'
import { FormError, FormState } from '../interfaces/formState'

const privateBetaSignInController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    await initialiseBasicAuthentication(req, res, next)

    const formState = req.session.formState?.privateBetaSignIn
    res.locals.errorList = formState?.errors
    if (formState && req.session.formState) {
      delete req.session.formState.privateBetaSignIn
    }

    res.locals.pageTitle = 'Enter service password'
    res.locals.backLink = paths.START
    res.locals.privateBetaSignInApi = paths.PRIVATE_BETA_SIGN_IN
    res.render('pages/private-beta-sign-in.njk')
  } catch (error) {
    return next(error)
  }
}

const WRONG_PASSWORD_ERROR: FormError = {
  text: 'The password you entered is not correct',
  href: '#password',
}

const validationRules = (password?: string): FormError[] => {
  const errors: FormError[] = []
  const value = password ?? ''

  if (!value.trim().length) {
    errors.push({ text: 'Enter private beta password', href: '#password' })
  }

  return errors
}

const postPrivateBetaSignInController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { password } = req.body as PrivateBetaSignInFormData

    const formErrors = validationRules(password)

    if (formErrors.length > 0) {
      const formState: FormState<PrivateBetaSignInFormData> = {
        errors: formErrors,
        formData: { password },
      }

      req.session.formState = req.session.formState || {}
      req.session.formState.privateBetaSignIn = formState

      return res.redirect(paths.PRIVATE_BETA_SIGN_IN)
    }

    const passwordCorrect: boolean = config.settings.password.split(';').includes(password)
    if (passwordCorrect) {
      delete req.session.formState?.privateBetaSignIn

      const { passwordExpirationInMinutes } = config.settings
      const passwordExpiration: number = Date.now() + passwordExpirationInMinutes * 60 * 1000
      res.cookie(PASSWORD_CORRECT, passwordCorrect, { signed: true })
      res.cookie(PASSWORD_EXPIRATION, passwordExpiration, { signed: true })

      const redirectTo = req.session.returnTo || paths.CASES.DASHBOARD
      delete req.session.returnTo
      return res.redirect(redirectTo)
    }

    clearPasswordCookies(res)

    const formState: FormState<PrivateBetaSignInFormData> = {
      errors: [WRONG_PASSWORD_ERROR],
      formData: { password: '' },
    }

    req.session.formState = req.session.formState || {}
    req.session.formState.privateBetaSignIn = formState

    return res.redirect(paths.PRIVATE_BETA_SIGN_IN)
  } catch (error) {
    return next(error)
  }
}
export { privateBetaSignInController, postPrivateBetaSignInController }
