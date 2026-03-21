import type { Request, Response, NextFunction } from 'express';
import { logger } from '../config/logger';

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
}

declare module 'express-serve-static-core' {
  interface Response {
    success: <T>(data: T, message?: string, status?: number) => void;
    fail: (message: string, status?: number) => void;
  }
}

export function responseMiddleware(req: Request, res: Response, next: NextFunction) {
  const start = Date.now();

  res.on('finish', () => {
    logger.info({
      method: req.method,
      url: req.url,
      status: res.statusCode,
      ms: Date.now() - start,
    });
  });

  res.success = function <T>(data: T, message = 'OK', status = 200) {
    const body: ApiResponse<T> = { success: true, message, data };
    this.status(status).json(body);
  };

  res.fail = function (message: string, status = 400) {
    const body: ApiResponse = { success: false, message };
    this.status(status).json(body);
  };

  next();
}
