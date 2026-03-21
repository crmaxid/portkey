import type { Request, Response, NextFunction } from 'express';
import { AxiosError } from 'axios';
import type { ApiResponse } from './response.middleware';

export function errorMiddleware(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof AxiosError) {
    const status = err.response?.status ?? 502;
    const message = err.response?.data?.message ?? err.message;
    const body: ApiResponse = { success: false, message };
    return res.status(status).json(body);
  }

  if (err instanceof Error) {
    const body: ApiResponse = { success: false, message: err.message };
    return res.status(500).json(body);
  }

  const body: ApiResponse = { success: false, message: 'Internal Server Error' };
  res.status(500).json(body);
}
