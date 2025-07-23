/* eslint-disable import/prefer-default-export */
import { NextFunction, Request, Response } from 'express'
import govukOneLogin from '../authentication/govukOneLogin'

export const AuthenticatedUser = (req: Request, res: Response, next: NextFunction) => {
  return govukOneLogin.authenticationMiddleware(req, res, next)
}
