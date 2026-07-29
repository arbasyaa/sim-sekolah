import { Response } from 'express';

interface ApiResponse<T> {
  status: 'success' | 'error';
  message: string;
  data: T | null;
}

export const sendSuccess = <T>(
  res: Response,
  message: string,
  data: T,
  statusCode: number = 200
): void => {
  const response: ApiResponse<T> = {
    status: 'success',
    message,
    data,
  };
  res.status(statusCode).json(response);
};

export const sendError = (
  res: Response,
  message: string,
  statusCode: number = 500
): void => {
  const response: ApiResponse<null> = {
    status: 'error',
    message,
    data: null,
  };
  res.status(statusCode).json(response);
};