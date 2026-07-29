import { Router } from 'express';
import { akademikController } from '../controllers/akademik.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';

const router = Router();

// Semua route akademik memerlukan autentikasi
router.use(authenticate);

// ===================== ROMBEL =====================
router.get('/rombel', akademikController.getAllRombel);
router.get('/rombel/:id', akademikController.getRombelById);
router.post('/rombel', authorize('SUPERADMIN', 'ADMIN_TU'), akademikController.createRombel);

// ===================== ANGGOTA ROMBEL =====================
router.post('/anggota-rombel', authorize('SUPERADMIN', 'ADMIN_TU'), akademikController.assignSiswa);
router.delete('/rombel/:rombelId/siswa/:siswaId', authorize('SUPERADMIN', 'ADMIN_TU'), akademikController.removeSiswa);

// ===================== PENGAMPU MAPEL =====================
router.post('/pengampu', authorize('SUPERADMIN', 'ADMIN_TU'), akademikController.createPengampu);
router.get('/pengampu/guru/:id', akademikController.getKelasByGuru);

// ===================== JADWAL =====================
router.post('/jadwal', authorize('SUPERADMIN', 'ADMIN_TU'), akademikController.createJadwal);
router.get('/jadwal', akademikController.getJadwal);
router.delete('/jadwal/:id', authorize('SUPERADMIN', 'ADMIN_TU'), akademikController.deleteJadwal);

// ===================== PRESENSI =====================
router.post('/presensi', authorize('SUPERADMIN', 'ADMIN_TU', 'GURU'), akademikController.inputPresensi);
router.get('/presensi', akademikController.getPresensi);

// ===================== NILAI =====================
router.post('/nilai', authorize('SUPERADMIN', 'GURU'), akademikController.inputNilai);
router.get('/nilai/rombel/:id', akademikController.getNilai);

// ===================== REKAP RAPORT =====================
router.get('/rekap/rombel/:id', akademikController.getRekapRaport);

export default router;