import type { Request, Response, NextFunction } from 'express';
import { HttpError } from '@makeplane/plane-node-sdk';
import { logger } from '../config/logger';
import type { ApiResponse } from './response.middleware';

export function errorMiddleware(err: unknown, req: Request, res: Response, _next: NextFunction) {
  if (err instanceof HttpError) {
    const status = err.statusCode ?? 502;
    const message = err.response?.error ?? err.message;
    logger.error({ method: req.method, url: req.url, status, message }, 'Plane API error');
    const body: ApiResponse = { success: false, message };
    return res.status(status).json(body);
  }

  if (err instanceof Error) {
    logger.error(
      { method: req.method, url: req.url, message: err.message, stack: err.stack },
      'Unhandled error',
    );
    const body: ApiResponse = { success: false, message: err.message };
    return res.status(500).json(body);
  }

  logger.error({ method: req.method, url: req.url, err }, 'Unknown error');
  const body: ApiResponse = { success: false, message: 'Internal Server Error' };
  res.status(500).json(body);
}
