import bcrypt from 'bcryptjs';
import jwt, { SignOptions } from 'jsonwebtoken';
import prisma from '../utils/prisma';
import { AppError } from '../utils/appError';
import { Role } from '@prisma/client';

const JWT_SECRET = process.env.JWT_SECRET || 'default-secret-change-me';

interface LoginResult {
  token: string;
  user: {
    id: number;
    username: string;
    role: Role;
    guru_id?: number | null;
  };
}

export const authService = {
  /**
   * Login: Verifikasi username & password, kembalikan JWT token
   */
  async login(username: string, password: string): Promise<LoginResult> {
    const user = await prisma.user.findUnique({
      where: { username },
      include: {
        guru: true
      }
    });

    if (!user) {
      throw new AppError(401, 'Username atau password salah.');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new AppError(401, 'Username atau password salah.');
    }

    const signOptions: SignOptions = {
      expiresIn: 86400, // 24 hours in seconds
    };

    const token = jwt.sign(
      { userId: user.id, role: user.role },
      JWT_SECRET,
      signOptions
    );

    return {
      token,
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
        guru_id: user.guru?.id,
      },
    };
  },

  /**
   * Register: Buat user baru (hanya digunakan oleh SUPERADMIN/ADMIN_TU)
   */
  async register(username: string, password: string, role: Role): Promise<{ id: number; username: string; role: Role }> {
    const existingUser = await prisma.user.findUnique({
      where: { username },
    });

    if (existingUser) {
      throw new AppError(409, 'Username sudah digunakan.');
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
        role,
      },
      select: {
        id: true,
        username: true,
        role: true,
      },
    });

    return newUser;
  },
};