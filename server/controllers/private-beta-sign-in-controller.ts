import { NextFunction, Request, Response } from 'express'
import { initialiseBasicAuthentication } from '../helpers/initialise-basic-authentication'
import paths from '../constants/paths'
import { PASSWORD_CORRECT, PASSWORD_EXPIRATION } from '../constants/cookiesUtils'
import config from '../config'
import { clearPasswordCookies } from '../utils/utils'

const privateBetaSignInController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    await initialiseBasicAuthentication(req, res, next)
    res.locals.pageTitle = 'Enter service password'
    res.locals.backLink = paths.START
    res.locals.privateBetaSignInApi = paths.PRIVATE_BETA_SIGN_IN
    res.render('pages/private-beta-sign-in.njk')
  } catch (error) {
    return next(error)
  }
}

const postPrivateBetaSignInController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const password = req.body?.password

    const passwordCorrect: boolean = config.settings.password.split(';').includes(password)
    if (passwordCorrect) {
      const { passwordExpirationInMinutes } = config.settings
      const passwordExpiration: number = Date.now() + passwordExpirationInMinutes * 60 * 1000
      res.cookie(PASSWORD_CORRECT, passwordCorrect, { signed: true })
      res.cookie(PASSWORD_EXPIRATION, passwordExpiration, { signed: true })

      const redirectTo = req.session.returnTo || paths.CASES.DASHBOARD
      delete req.session.returnTo
      return res.redirect(redirectTo)
    }

    clearPasswordCookies(res)

    return res.redirect(paths.PRIVATE_BETA_SIGN_IN)
  } catch (error) {
    return next(error)
  }
}
export { privateBetaSignInController, postPrivateBetaSignInController }
