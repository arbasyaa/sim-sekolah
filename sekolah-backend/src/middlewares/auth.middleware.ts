import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppError } from '../utils/appError';
import { Role } from '@prisma/client';

interface JwtPayload {
  userId: number;
  role: Role;
}

// Extend Express Request to include user data
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

const JWT_SECRET = process.env.JWT_SECRET || 'default-secret-change-me';

/**
 * Middleware: Verifikasi JWT Token dari header Authorization
 */
export const authenticate = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new AppError(401, 'Token tidak ditemukan. Silakan login terlebih dahulu.');
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    req.user = decoded;
    next();
  } catch {
    throw new AppError(401, 'Token tidak valid atau sudah kedaluwarsa.');
  }
};

/**
 * Middleware: Role-Based Access Control (RBAC)
 * Hanya role tertentu yang bisa mengakses endpoint
 */
export const authorize = (...allowedRoles: Role[]) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      throw new AppError(401, 'Autentikasi diperlukan.');
    }

    if (!allowedRoles.includes(req.user.role)) {
      throw new AppError(403, 'Anda tidak memiliki akses ke resource ini.');
    }

    next();
  };
};