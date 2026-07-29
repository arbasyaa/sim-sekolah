import { Request, Response } from 'express';
import { z } from 'zod';
import { authService } from '../services/auth.service';
import { sendSuccess } from '../utils/response';
import { asyncWrapper } from '../utils/asyncWrapper';
import { AppError } from '../utils/appError';
import prisma from '../utils/prisma';

// Zod Schemas
const loginSchema = z.object({
    username: z.string().min(1, 'Username wajib diisi'),
    password: z.string().min(1, 'Password wajib diisi'),
});

export const authController = {
    login: asyncWrapper(async (req: Request, res: Response) => {
        const { username, password } = loginSchema.parse(req.body);
        const result = await authService.login(username, password);
        sendSuccess(res, 'Login berhasil.', result);
    }),

    me: asyncWrapper(async (req: Request, res: Response) => {
        if (!req.user) {
            throw new AppError(401, 'Autentikasi diperlukan.');
        }

        const user = await prisma.user.findUnique({
            where: { id: req.user.userId },
            select: { id: true, username: true, role: true },
        });

        if (!user) {
            throw new AppError(404, 'User tidak ditemukan.');
        }

        sendSuccess(res, 'Data user berhasil diambil.', user);
    }),
};
