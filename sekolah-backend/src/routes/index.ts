import { Router } from 'express';
import authRoutes from './auth.routes';
import masterRoutes from './master.routes';
import akademikRoutes from './akademik.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/master', masterRoutes);
router.use('/akademik', akademikRoutes);

export default router;