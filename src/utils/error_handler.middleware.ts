// errorMiddleware.js

import { NextFunction, Request, Response } from 'express'

function errorHandler (err: Error, _req: Request, res: Response, _next: NextFunction): void {
  console.error(err.stack)
  res.status(500).json({ error: err.message })
}

export default errorHandler
