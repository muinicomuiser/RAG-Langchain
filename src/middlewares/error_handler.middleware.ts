import { NextFunction, Request, Response } from 'express'
import { CustomError } from '../types'

function errorHandler (err: CustomError, _req: Request, res: Response, _next: NextFunction): void {
  console.error(err)
  res.status(err.statusCode ?? 500).json({ error: err.message })
}

export default errorHandler
