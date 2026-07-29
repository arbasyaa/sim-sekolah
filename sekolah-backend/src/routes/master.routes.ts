import { Router } from 'express';
import { masterController } from '../controllers/master.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';
import multer from 'multer';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

// Semua route master memerlukan autentikasi
router.use(authenticate);

// ===================== IMPORT =====================
router.post('/guru/import', authorize('SUPERADMIN', 'ADMIN_TU'), upload.single('file'), masterController.importGuru);
router.post('/siswa/import', authorize('SUPERADMIN', 'ADMIN_TU'), upload.single('file'), masterController.importSiswa);

// ===================== GURU =====================
router.get('/guru', masterController.getAllGuru);
router.get('/guru/:id', masterController.getGuruById);
router.post('/guru', authorize('SUPERADMIN', 'ADMIN_TU'), masterController.createGuru);
router.put('/guru/:id', authorize('SUPERADMIN', 'ADMIN_TU'), masterController.updateGuru);
router.delete('/guru/:id', authorize('SUPERADMIN', 'ADMIN_TU'), masterController.deleteGuru);

// ===================== SISWA =====================
router.get('/siswa', masterController.getAllSiswa);
router.get('/siswa/:id', masterController.getSiswaById);
router.post('/siswa', authorize('SUPERADMIN', 'ADMIN_TU'), masterController.createSiswa);
router.put('/siswa/:id', authorize('SUPERADMIN', 'ADMIN_TU'), masterController.updateSiswa);
router.delete('/siswa/:id', authorize('SUPERADMIN', 'ADMIN_TU'), masterController.deleteSiswa);

// ===================== MAPEL =====================
router.get('/mapel', masterController.getAllMapel);
router.get('/mapel/:id', masterController.getMapelById);
router.post('/mapel', authorize('SUPERADMIN', 'ADMIN_TU'), masterController.createMapel);
router.put('/mapel/:id', authorize('SUPERADMIN', 'ADMIN_TU'), masterController.updateMapel);
router.delete('/mapel/:id', authorize('SUPERADMIN', 'ADMIN_TU'), masterController.deleteMapel);

// ===================== TAHUN AJARAN =====================
router.get('/tahun-ajaran', masterController.getAllTahunAjaran);
router.post('/tahun-ajaran', authorize('SUPERADMIN', 'ADMIN_TU'), masterController.createTahunAjaran);
router.patch('/tahun-ajaran/:id/activate', authorize('SUPERADMIN', 'ADMIN_TU'), masterController.setTahunAjaranAktif);

export default router;