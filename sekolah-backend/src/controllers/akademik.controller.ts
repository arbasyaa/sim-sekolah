import { Request, Response } from 'express';
import { z } from 'zod';
import { akademikService } from '../services/akademik.service';
import { sendSuccess } from '../utils/response';
import { asyncWrapper } from '../utils/asyncWrapper';

// ================= ZOD SCHEMAS =================
const idParamSchema = z.object({
  id: z.string().transform((val) => parseInt(val, 10)),
});

const createRombelSchema = z.object({
  tahun_ajaran_id: z.number().int().positive(),
  wali_kelas_id: z.number().int().positive(),
  tingkat: z.number().int().min(1).max(12),
  nama_kelas: z.string().min(1, 'Nama kelas wajib diisi'),
});

const assignSiswaSchema = z.object({
  rombel_id: z.number().int().positive(),
  siswa_ids: z.array(z.number().int().positive()).min(1, 'Minimal 1 siswa'),
});

const removeSiswaParamSchema = z.object({
  rombelId: z.string().transform((val) => parseInt(val, 10)),
  siswaId: z.string().transform((val) => parseInt(val, 10)),
});

const createPengampuSchema = z.object({
  guru_id: z.number().int().positive(),
  mapel_id: z.number().int().positive(),
  rombel_id: z.number().int().positive(),
});

const inputPresensiSchema = z.object({
  tanggal: z.string().transform((val) => new Date(val)),
  items: z.array(z.object({
    anggota_rombel_id: z.number().int().positive(),
    status: z.enum(['HADIR', 'SAKIT', 'IZIN', 'ALPA']),
  })).min(1),
});

const getPresensiQuerySchema = z.object({
  tanggal: z.string().transform((val) => new Date(val)),
});

const inputNilaiSchema = z.object({
  items: z.array(z.object({
    anggota_rombel_id: z.number().int().positive(),
    pengampu_mapel_id: z.number().int().positive(),
    jenis_nilai: z.enum(['TUGAS', 'UTS', 'UAS']),
    urutan: z.number().int().positive(),
    skor: z.number().min(0).max(100),
  })).min(1),
});

const getNilaiQuerySchema = z.object({
  pengampu_mapel_id: z.string().transform((val) => parseInt(val, 10)),
});

// ================= CONTROLLER =================
export const akademikController = {
  // ===================== ROMBEL =====================
  getAllRombel: asyncWrapper(async (req: Request, res: Response) => {
    const tahunAjaranId = req.query.tahun_ajaran_id
      ? parseInt(req.query.tahun_ajaran_id as string, 10)
      : undefined;
    const data = await akademikService.getAllRombel(tahunAjaranId);
    sendSuccess(res, 'Data rombel berhasil diambil.', data);
  }),

  getRombelById: asyncWrapper(async (req: Request, res: Response) => {
    const { id } = idParamSchema.parse(req.params);
    const data = await akademikService.getRombelById(id);
    sendSuccess(res, 'Data rombel berhasil diambil.', data);
  }),

  createRombel: asyncWrapper(async (req: Request, res: Response) => {
    const body = createRombelSchema.parse(req.body);
    const data = await akademikService.createRombel(body);
    sendSuccess(res, 'Rombel berhasil dibuat.', data, 201);
  }),

  // ===================== ANGGOTA ROMBEL =====================
  assignSiswa: asyncWrapper(async (req: Request, res: Response) => {
    const body = assignSiswaSchema.parse(req.body);
    const data = await akademikService.assignSiswaToRombel(body);
    sendSuccess(res, 'Siswa berhasil ditambahkan ke rombel.', data, 201);
  }),

  removeSiswa: asyncWrapper(async (req: Request, res: Response) => {
    const { rombelId, siswaId } = removeSiswaParamSchema.parse(req.params);
    await akademikService.removeSiswaFromRombel(rombelId, siswaId);
    sendSuccess(res, 'Siswa berhasil dikeluarkan dari rombel.', null);
  }),

  // ===================== PENGAMPU MAPEL =====================
  createPengampu: asyncWrapper(async (req: Request, res: Response) => {
    const body = createPengampuSchema.parse(req.body);
    const data = await akademikService.createPengampu(body);
    sendSuccess(res, 'Pengampu mapel berhasil ditambahkan.', data, 201);
  }),

  getKelasByGuru: asyncWrapper(async (req: Request, res: Response) => {
    const { id } = idParamSchema.parse(req.params);
    const data = await akademikService.getKelasByGuruId(id);
    sendSuccess(res, 'Data kelas yang diampu berhasil diambil.', data);
  }),

  // ===================== PRESENSI =====================
  inputPresensi: asyncWrapper(async (req: Request, res: Response) => {
    const { tanggal, items } = inputPresensiSchema.parse(req.body);
    const data = await akademikService.inputPresensi(tanggal, items);
    sendSuccess(res, 'Presensi berhasil disimpan.', data);
  }),

  getPresensi: asyncWrapper(async (req: Request, res: Response) => {
    const { id } = idParamSchema.parse(req.params);
    const { tanggal } = getPresensiQuerySchema.parse(req.query);
    const data = await akademikService.getPresensiByRombel(id, tanggal);
    sendSuccess(res, 'Data presensi berhasil diambil.', data);
  }),

  // ===================== NILAI =====================
  inputNilai: asyncWrapper(async (req: Request, res: Response) => {
    const { items } = inputNilaiSchema.parse(req.body);
    const data = await akademikService.inputNilai(items);
    sendSuccess(res, 'Nilai berhasil disimpan.', data);
  }),

  getNilai: asyncWrapper(async (req: Request, res: Response) => {
    const { id } = idParamSchema.parse(req.params);
    const { pengampu_mapel_id } = getNilaiQuerySchema.parse(req.query);
    const data = await akademikService.getNilaiByRombelAndMapel(id, pengampu_mapel_id);
    sendSuccess(res, 'Data nilai berhasil diambil.', data);
  }),

  // ===================== REKAP RAPORT =====================
  getRekapRaport: asyncWrapper(async (req: Request, res: Response) => {
    const { id } = idParamSchema.parse(req.params);
    const data = await akademikService.getRekapNilaiRombel(id);
    sendSuccess(res, 'Rekap nilai rombel berhasil diambil.', data);
  }),
};