import { Request, Response } from 'express';
import { z } from 'zod';
import { masterService } from '../services/master.service';
import { sendSuccess } from '../utils/response';
import { asyncWrapper } from '../utils/asyncWrapper';
import { AppError } from '../utils/appError';

// ================= ZOD SCHEMAS =================
const idParamSchema = z.object({
  id: z.string().transform((val) => parseInt(val, 10)),
});

const createGuruSchema = z.object({
  nip: z.string().optional(),
  nama_lengkap: z.string().min(1, 'Nama lengkap wajib diisi'),
  no_hp: z.string().optional(),
});

const updateGuruSchema = z.object({
  nip: z.string().optional(),
  nama_lengkap: z.string().min(1).optional(),
  no_hp: z.string().optional(),
});

const createSiswaSchema = z.object({
  nis: z.string().min(1, 'NIS wajib diisi'),
  nisn: z.string().min(1, 'NISN wajib diisi'),
  nama_lengkap: z.string().min(1, 'Nama lengkap wajib diisi'),
  jenis_kelamin: z.enum(['L', 'P']),
});

const updateSiswaSchema = z.object({
  nis: z.string().min(1).optional(),
  nisn: z.string().min(1).optional(),
  nama_lengkap: z.string().min(1).optional(),
  jenis_kelamin: z.enum(['L', 'P']).optional(),
});

const createMapelSchema = z.object({
  kode_mapel: z.string().min(1, 'Kode mapel wajib diisi'),
  nama_mapel: z.string().min(1, 'Nama mapel wajib diisi'),
});

const updateMapelSchema = z.object({
  kode_mapel: z.string().min(1).optional(),
  nama_mapel: z.string().min(1).optional(),
});

const createTahunAjaranSchema = z.object({
  nama: z.string().min(1, 'Nama tahun ajaran wajib diisi'),
  semester: z.enum(['GANJIL', 'GENAP']),
});

// ================= CONTROLLER =================
export const masterController = {
  // ===================== GURU =====================
  getAllGuru: asyncWrapper(async (_req: Request, res: Response) => {
    const data = await masterService.getAllGuru();
    sendSuccess(res, 'Data guru berhasil diambil.', data);
  }),

  getGuruById: asyncWrapper(async (req: Request, res: Response) => {
    const { id } = idParamSchema.parse(req.params);
    const data = await masterService.getGuruById(id);
    sendSuccess(res, 'Data guru berhasil diambil.', data);
  }),

  createGuru: asyncWrapper(async (req: Request, res: Response) => {
    const body = createGuruSchema.parse(req.body);
    const data = await masterService.createGuru(body);
    sendSuccess(res, 'Guru berhasil ditambahkan.', data, 201);
  }),

  updateGuru: asyncWrapper(async (req: Request, res: Response) => {
    const { id } = idParamSchema.parse(req.params);
    const body = updateGuruSchema.parse(req.body);
    const data = await masterService.updateGuru(id, body);
    sendSuccess(res, 'Guru berhasil diperbarui.', data);
  }),

  deleteGuru: asyncWrapper(async (req: Request, res: Response) => {
    const { id } = idParamSchema.parse(req.params);
    await masterService.deleteGuru(id);
    sendSuccess(res, 'Guru berhasil dihapus.', null);
  }),

  // ===================== SISWA =====================
  getAllSiswa: asyncWrapper(async (_req: Request, res: Response) => {
    const data = await masterService.getAllSiswa();
    sendSuccess(res, 'Data siswa berhasil diambil.', data);
  }),

  getSiswaById: asyncWrapper(async (req: Request, res: Response) => {
    const { id } = idParamSchema.parse(req.params);
    const data = await masterService.getSiswaById(id);
    sendSuccess(res, 'Data siswa berhasil diambil.', data);
  }),

  createSiswa: asyncWrapper(async (req: Request, res: Response) => {
    const body = createSiswaSchema.parse(req.body);
    const data = await masterService.createSiswa(body);
    sendSuccess(res, 'Siswa berhasil ditambahkan.', data, 201);
  }),

  updateSiswa: asyncWrapper(async (req: Request, res: Response) => {
    const { id } = idParamSchema.parse(req.params);
    const body = updateSiswaSchema.parse(req.body);
    const data = await masterService.updateSiswa(id, body);
    sendSuccess(res, 'Siswa berhasil diperbarui.', data);
  }),

  deleteSiswa: asyncWrapper(async (req: Request, res: Response) => {
    const { id } = idParamSchema.parse(req.params);
    await masterService.deleteSiswa(id);
    sendSuccess(res, 'Siswa berhasil dihapus.', null);
  }),

  // ===================== MAPEL =====================
  getAllMapel: asyncWrapper(async (_req: Request, res: Response) => {
    const data = await masterService.getAllMapel();
    sendSuccess(res, 'Data mapel berhasil diambil.', data);
  }),

  getMapelById: asyncWrapper(async (req: Request, res: Response) => {
    const { id } = idParamSchema.parse(req.params);
    const data = await masterService.getMapelById(id);
    sendSuccess(res, 'Data mapel berhasil diambil.', data);
  }),

  createMapel: asyncWrapper(async (req: Request, res: Response) => {
    const body = createMapelSchema.parse(req.body);
    const data = await masterService.createMapel(body);
    sendSuccess(res, 'Mapel berhasil ditambahkan.', data, 201);
  }),

  updateMapel: asyncWrapper(async (req: Request, res: Response) => {
    const { id } = idParamSchema.parse(req.params);
    const body = updateMapelSchema.parse(req.body);
    const data = await masterService.updateMapel(id, body);
    sendSuccess(res, 'Mapel berhasil diperbarui.', data);
  }),

  deleteMapel: asyncWrapper(async (req: Request, res: Response) => {
    const { id } = idParamSchema.parse(req.params);
    await masterService.deleteMapel(id);
    sendSuccess(res, 'Mapel berhasil dihapus.', null);
  }),

  // ===================== TAHUN AJARAN =====================
  getAllTahunAjaran: asyncWrapper(async (_req: Request, res: Response) => {
    const data = await masterService.getAllTahunAjaran();
    sendSuccess(res, 'Data tahun ajaran berhasil diambil.', data);
  }),

  createTahunAjaran: asyncWrapper(async (req: Request, res: Response) => {
    const body = createTahunAjaranSchema.parse(req.body);
    const data = await masterService.createTahunAjaran(body);
    sendSuccess(res, 'Tahun ajaran berhasil ditambahkan.', data, 201);
  }),

  setTahunAjaranAktif: asyncWrapper(async (req: Request, res: Response) => {
    const { id } = idParamSchema.parse(req.params);
    const data = await masterService.setTahunAjaranAktif(id);
    sendSuccess(res, 'Tahun ajaran berhasil diaktifkan.', data);
  }),

  // ===================== IMPORT EXCEL =====================
  importGuru: asyncWrapper(async (req: Request, res: Response) => {
    const file = (req as any).file;
    if (!file) {
      throw new AppError(400, 'File Excel tidak ditemukan');
    }

    const xlsx = require('xlsx');
    const workbook = xlsx.read(file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

    if (!data || data.length === 0) {
      throw new AppError(400, 'File Excel kosong atau format tidak valid');
    }

    const result = await masterService.importGuru(data);
    sendSuccess(res, 'Proses import selesai', result);
  }),

  importSiswa: asyncWrapper(async (req: Request, res: Response) => {
    const file = (req as any).file;
    if (!file) {
      throw new AppError(400, 'File Excel tidak ditemukan');
    }

    const xlsx = require('xlsx');
    const workbook = xlsx.read(file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

    if (!data || data.length === 0) {
      throw new AppError(400, 'File Excel kosong atau format tidak valid');
    }

    const result = await masterService.importSiswa(data);
    sendSuccess(res, 'Proses import selesai', result);
  }),
};
