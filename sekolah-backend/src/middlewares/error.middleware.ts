import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/appError';
import { ZodError } from 'zod';

export const globalErrorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  // Handle Zod validation errors
  if (err instanceof ZodError) {
    const formattedErrors = err.errors.map((e) => ({
      field: e.path.join('.'),
      message: e.message,
    }));

    res.status(400).json({
      status: 'error',
      message: 'Validasi gagal',
      data: formattedErrors,
    });
    return;
  }

  // Handle custom AppError
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      status: 'error',
      message: err.message,
      data: null,
    });
    return;
  }

  // Handle unknown errors
  console.error('Unexpected Error:', err);
  res.status(500).json({
    status: 'error',
    message: 'Terjadi kesalahan internal pada server',
    data: null,
  });
};