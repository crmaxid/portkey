import type { Request, Response, NextFunction } from 'express';

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

export function responseMiddleware(_req: Request, res: Response, next: NextFunction) {
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
