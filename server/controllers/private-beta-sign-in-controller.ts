import { NextFunction, Request, Response } from 'express'
import { initialiseBasicAuthentication } from '../helpers/initialise-basic-authentication'
import paths from '../constants/paths'
import { PASSWORD_CORRECT } from '../constants/cookiesUtils'
import config from '../config'
import { clearPasswordCookie, getSafeReturnPath } from '../utils/utils'
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

    clearPasswordCookie(res)

    res.locals.pageTitle = req.t('private-beta-sign-in:pageTitle')
    res.locals.backLink = paths.START
    res.locals.privateBetaSignInApi = paths.PRIVATE_BETA_SIGN_IN
    return res.render('pages/private-beta-sign-in.njk')
  } catch (error) {
    return next(error)
  }
}

const validationRules = (password: string | undefined, emptyPasswordText: string): FormError[] => {
  const errors: FormError[] = []
  const value = password ?? ''

  if (!value.trim().length) {
    errors.push({ text: emptyPasswordText, href: '#password' })
  }

  return errors
}

const postPrivateBetaSignInController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { password } = req.body as PrivateBetaSignInFormData

    const formErrors = validationRules(password, req.t('private-beta-sign-in:errors.emptyPassword'))

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
      const maxAgeMs = passwordExpirationInMinutes * 60 * 1000
      // Expiry via maxAge only — do not store timestamps in cookie values (CodeQL / sensitive cleartext).
      res.cookie(PASSWORD_CORRECT, true, {
        signed: true,
        maxAge: maxAgeMs,
        httpOnly: true,
        sameSite: 'lax',
        secure: Boolean(config.https),
      })

      const redirectTo = getSafeReturnPath(req.session.returnTo, paths.CASES.DASHBOARD)
      delete req.session.returnTo
      return res.redirect(redirectTo)
    }

    clearPasswordCookie(res)

    const formState: FormState<PrivateBetaSignInFormData> = {
      errors: [{ text: req.t('private-beta-sign-in:errors.wrongPassword'), href: '#password' }],
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
