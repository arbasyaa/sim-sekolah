import prisma from '../utils/prisma';
import { AppError } from '../utils/appError';
import { JenisKelamin, Semester } from '@prisma/client';

// ================= GURU =================
interface CreateGuruData {
  nip?: string;
  nama_lengkap: string;
  no_hp?: string;
}

interface UpdateGuruData {
  nip?: string;
  nama_lengkap?: string;
  no_hp?: string;
}

// ================= SISWA =================
interface CreateSiswaData {
  nis: string;
  nisn: string;
  nama_lengkap: string;
  jenis_kelamin: JenisKelamin;
}

interface UpdateSiswaData {
  nis?: string;
  nisn?: string;
  nama_lengkap?: string;
  jenis_kelamin?: JenisKelamin;
}

// ================= MAPEL =================
interface CreateMapelData {
  kode_mapel: string;
  nama_mapel: string;
}

interface UpdateMapelData {
  kode_mapel?: string;
  nama_mapel?: string;
}

// ================= TAHUN AJARAN =================
interface CreateTahunAjaranData {
  nama: string;
  semester: Semester;
}

export const masterService = {
  // ===================== GURU =====================
  async getAllGuru() {
    return prisma.guru.findMany({
      include: { user: { select: { id: true, username: true, role: true } } },
      orderBy: { nama_lengkap: 'asc' },
    });
  },

  async getGuruById(id: number) {
    const guru = await prisma.guru.findUnique({
      where: { id },
      include: { user: { select: { id: true, username: true, role: true } } },
    });

    if (!guru) {
      throw new AppError(404, 'Guru tidak ditemukan.');
    }

    return guru;
  },

  async createGuru(data: CreateGuruData) {
    if (data.nip) {
      const existing = await prisma.guru.findUnique({ where: { nip: data.nip } });
      if (existing) {
        throw new AppError(409, 'NIP sudah terdaftar.');
      }
    }

    return prisma.guru.create({ data });
  },

  async updateGuru(id: number, data: UpdateGuruData) {
    await masterService.getGuruById(id); // Check existence

    if (data.nip) {
      const existing = await prisma.guru.findUnique({ where: { nip: data.nip } });
      if (existing && existing.id !== id) {
        throw new AppError(409, 'NIP sudah digunakan oleh guru lain.');
      }
    }

    return prisma.guru.update({ where: { id }, data });
  },

  async deleteGuru(id: number) {
    await masterService.getGuruById(id); // Check existence
    return prisma.guru.delete({ where: { id } });
  },

  // ===================== SISWA =====================
  async getAllSiswa() {
    return prisma.siswa.findMany({
      orderBy: { nama_lengkap: 'asc' },
    });
  },

  async getSiswaById(id: number) {
    const siswa = await prisma.siswa.findUnique({
      where: { id },
    });

    if (!siswa) {
      throw new AppError(404, 'Siswa tidak ditemukan.');
    }

    return siswa;
  },

  async createSiswa(data: CreateSiswaData) {
    const existingNis = await prisma.siswa.findUnique({ where: { nis: data.nis } });
    if (existingNis) {
      throw new AppError(409, 'NIS sudah terdaftar.');
    }

    const existingNisn = await prisma.siswa.findUnique({ where: { nisn: data.nisn } });
    if (existingNisn) {
      throw new AppError(409, 'NISN sudah terdaftar.');
    }

    return prisma.siswa.create({ data });
  },

  async updateSiswa(id: number, data: UpdateSiswaData) {
    await masterService.getSiswaById(id); // Check existence

    if (data.nis) {
      const existing = await prisma.siswa.findUnique({ where: { nis: data.nis } });
      if (existing && existing.id !== id) {
        throw new AppError(409, 'NIS sudah digunakan oleh siswa lain.');
      }
    }

    if (data.nisn) {
      const existing = await prisma.siswa.findUnique({ where: { nisn: data.nisn } });
      if (existing && existing.id !== id) {
        throw new AppError(409, 'NISN sudah digunakan oleh siswa lain.');
      }
    }

    return prisma.siswa.update({ where: { id }, data });
  },

  async deleteSiswa(id: number) {
    await masterService.getSiswaById(id); // Check existence
    return prisma.siswa.delete({ where: { id } });
  },

  // ===================== MAPEL =====================
  async getAllMapel() {
    return prisma.mapel.findMany({
      orderBy: { nama_mapel: 'asc' },
    });
  },

  async getMapelById(id: number) {
    const mapel = await prisma.mapel.findUnique({
      where: { id },
    });

    if (!mapel) {
      throw new AppError(404, 'Mata pelajaran tidak ditemukan.');
    }

    return mapel;
  },

  async createMapel(data: CreateMapelData) {
    const existing = await prisma.mapel.findUnique({ where: { kode_mapel: data.kode_mapel } });
    if (existing) {
      throw new AppError(409, 'Kode mapel sudah terdaftar.');
    }

    return prisma.mapel.create({ data });
  },

  async updateMapel(id: number, data: UpdateMapelData) {
    await masterService.getMapelById(id); // Check existence

    if (data.kode_mapel) {
      const existing = await prisma.mapel.findUnique({ where: { kode_mapel: data.kode_mapel } });
      if (existing && existing.id !== id) {
        throw new AppError(409, 'Kode mapel sudah digunakan.');
      }
    }

    return prisma.mapel.update({ where: { id }, data });
  },

  async deleteMapel(id: number) {
    await masterService.getMapelById(id); // Check existence
    return prisma.mapel.delete({ where: { id } });
  },

  // ===================== TAHUN AJARAN =====================
  async getAllTahunAjaran() {
    return prisma.tahunAjaran.findMany({
      orderBy: { id: 'desc' },
    });
  },

  async getTahunAjaranById(id: number) {
    const tahunAjaran = await prisma.tahunAjaran.findUnique({
      where: { id },
    });

    if (!tahunAjaran) {
      throw new AppError(404, 'Tahun ajaran tidak ditemukan.');
    }

    return tahunAjaran;
  },

  async createTahunAjaran(data: CreateTahunAjaranData) {
    return prisma.tahunAjaran.create({ data });
  },

  /**
   * Set tahun ajaran aktif — hanya 1 yang boleh aktif
   * Nonaktifkan semua lalu aktifkan yang dipilih
   */
  async setTahunAjaranAktif(id: number) {
    await masterService.getTahunAjaranById(id); // Check existence

    // Nonaktifkan semua
    await prisma.tahunAjaran.updateMany({
      data: { is_active: false },
    });

    // Aktifkan yang dipilih
    return prisma.tahunAjaran.update({
      where: { id },
      data: { is_active: true },
    });
  },

  // ===================== IMPORT EXCEL =====================
  async importGuru(data: any[]) {
    const results = { success: 0, failed: 0, errors: [] as string[] };
    
    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      try {
        if (!row.nip || !row.nama_lengkap) {
          throw new Error('NIP dan Nama Lengkap harus diisi');
        }

        // Cek NIP duplikat
        const existingGuru = await prisma.guru.findUnique({
          where: { nip: String(row.nip) }
        });

        if (existingGuru) {
          throw new Error(`Guru dengan NIP ${row.nip} sudah ada`);
        }

        await prisma.guru.create({
          data: {
            nip: String(row.nip),
            nama_lengkap: row.nama_lengkap,
            no_hp: row.no_hp ? String(row.no_hp) : null,
          }
        });
        results.success++;
      } catch (error: any) {
        results.failed++;
        results.errors.push(`Baris ${i + 2}: ${error.message}`);
      }
    }
    return results;
  },

  async importSiswa(data: any[]) {
    const results = { success: 0, failed: 0, errors: [] as string[] };
    
    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      try {
        if (!row.nis || !row.nisn || !row.nama_lengkap || !row.jenis_kelamin) {
          throw new Error('NIS, NISN, Nama Lengkap, dan Jenis Kelamin harus diisi');
        }

        const jk = row.jenis_kelamin.toUpperCase();
        if (jk !== 'L' && jk !== 'P') {
          throw new Error('Jenis kelamin harus L atau P');
        }

        // Cek NIS/NISN duplikat
        const existingSiswa = await prisma.siswa.findFirst({
          where: {
            OR: [
              { nis: String(row.nis) },
              { nisn: String(row.nisn) }
            ]
          }
        });

        if (existingSiswa) {
          throw new Error(`Siswa dengan NIS ${row.nis} atau NISN ${row.nisn} sudah ada`);
        }

        await prisma.siswa.create({
          data: {
            nis: String(row.nis),
            nisn: String(row.nisn),
            nama_lengkap: row.nama_lengkap,
            jenis_kelamin: jk as JenisKelamin,
          }
        });
        results.success++;
      } catch (error: any) {
        results.failed++;
        results.errors.push(`Baris ${i + 2}: ${error.message}`);
      }
    }
    return results;
  },
};
