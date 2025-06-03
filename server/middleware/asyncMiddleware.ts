import type { Request, Response, NextFunction, RequestHandler } from 'express'

export default function asyncMiddleware(requestHandler: RequestHandler): RequestHandler {
  return (req: Request, res: Response, next: NextFunction): Promise<void> => {
    return Promise.resolve(requestHandler(req, res, next)).catch(next)
  }
}
