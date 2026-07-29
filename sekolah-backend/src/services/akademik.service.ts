import prisma from '../utils/prisma';
import { AppError } from '../utils/appError';
import { StatusPresensi, JenisNilai, Hari } from '@prisma/client';

// ================= INTERFACES =================
interface CreateRombelData {
    tahun_ajaran_id: number;
    wali_kelas_id: number;
    tingkat: number;
    nama_kelas: string;
}

interface AssignSiswaToRombelData {
    rombel_id: number;
    siswa_ids: number[];
}

interface CreatePengampuData {
    guru_id: number;
    mapel_id: number;
    rombel_id: number;
}

interface CreateJadwalData {
    pengampu_mapel_id: number;
    hari: Hari;
    jam_mulai: string;
    jam_selesai: string;
}

interface InputPresensiItem {
    anggota_rombel_id: number;
    status: StatusPresensi;
}

interface InputNilaiItem {
    anggota_rombel_id: number;
    pengampu_mapel_id: number;
    jenis_nilai: JenisNilai;
    urutan: number;
    skor: number;
}

export const akademikService = {
    // ===================== ROMBEL =====================
    async getAllRombel(tahunAjaranId?: number) {
        return prisma.rombel.findMany({
            where: tahunAjaranId ? { tahun_ajaran_id: tahunAjaranId } : undefined,
            include: {
                tahun_ajaran: true,
                wali_kelas: { select: { id: true, nama_lengkap: true, nip: true } },
                _count: { select: { anggota_kelas: true } },
            },
            orderBy: [{ tingkat: 'asc' }, { nama_kelas: 'asc' }],
        });
    },

    async getRombelById(id: number) {
        const rombel = await prisma.rombel.findUnique({
            where: { id },
            include: {
                tahun_ajaran: true,
                wali_kelas: { select: { id: true, nama_lengkap: true, nip: true } },
                anggota_kelas: {
                    include: { siswa: true },
                    orderBy: { siswa: { nama_lengkap: 'asc' } },
                },
                mapel_diajarkan: {
                    include: {
                        guru: { select: { id: true, nama_lengkap: true } },
                        mapel: true,
                    },
                },
            },
        });

        if (!rombel) {
            throw new AppError(404, 'Rombel tidak ditemukan.');
        }

        return rombel;
    },

    async createRombel(data: CreateRombelData) {
        const tahunAjaran = await prisma.tahunAjaran.findUnique({
            where: { id: data.tahun_ajaran_id },
        });
        if (!tahunAjaran) {
            throw new AppError(404, 'Tahun ajaran tidak ditemukan.');
        }

        const guru = await prisma.guru.findUnique({
            where: { id: data.wali_kelas_id },
        });
        if (!guru) {
            throw new AppError(404, 'Guru wali kelas tidak ditemukan.');
        }

        return prisma.rombel.create({
            data,
            include: {
                tahun_ajaran: true,
                wali_kelas: { select: { id: true, nama_lengkap: true } },
            },
        });
    },

    // ===================== ANGGOTA ROMBEL =====================
    async assignSiswaToRombel(data: AssignSiswaToRombelData) {
        const rombel = await prisma.rombel.findUnique({
            where: { id: data.rombel_id },
        });
        if (!rombel) {
            throw new AppError(404, 'Rombel tidak ditemukan.');
        }

        const createData = data.siswa_ids.map((siswa_id) => ({
            rombel_id: data.rombel_id,
            siswa_id,
        }));

        const result = await prisma.anggotaRombel.createMany({
            data: createData,
            skipDuplicates: true,
        });

        return { assigned: result.count };
    },

    async removeSiswaFromRombel(rombelId: number, siswaId: number) {
        const anggota = await prisma.anggotaRombel.findFirst({
            where: { rombel_id: rombelId, siswa_id: siswaId },
        });

        if (!anggota) {
            throw new AppError(404, 'Siswa tidak terdaftar di rombel ini.');
        }

        return prisma.anggotaRombel.delete({ where: { id: anggota.id } });
    },

    // ===================== PENGAMPU MAPEL =====================
    async getAllPengampu() {
        return prisma.pengampuMapel.findMany({
            include: {
                guru: true,
                mapel: true,
                rombel: {
                    include: {
                        tahun_ajaran: true
                    }
                }
            },
            orderBy: {
                id: 'desc'
            }
        });
    },

    async createPengampu(data: CreatePengampuData) {
        const guru = await prisma.guru.findUnique({ where: { id: data.guru_id } });
        if (!guru) throw new AppError(404, 'Guru tidak ditemukan.');

        const mapel = await prisma.mapel.findUnique({ where: { id: data.mapel_id } });
        if (!mapel) throw new AppError(404, 'Mata pelajaran tidak ditemukan.');

        const rombel = await prisma.rombel.findUnique({ where: { id: data.rombel_id } });
        if (!rombel) throw new AppError(404, 'Rombel tidak ditemukan.');

        const existing = await prisma.pengampuMapel.findUnique({
            where: { mapel_id_rombel_id: { mapel_id: data.mapel_id, rombel_id: data.rombel_id } },
        });
        if (existing) {
            throw new AppError(409, 'Mata pelajaran ini sudah diampu di rombel tersebut.');
        }

        return prisma.pengampuMapel.create({
            data,
            include: {
                guru: { select: { id: true, nama_lengkap: true } },
                mapel: true,
                rombel: { select: { id: true, nama_kelas: true } },
            },
        });
    },

    async getKelasByGuruId(guruId: number) {
        return prisma.pengampuMapel.findMany({
            where: { guru_id: guruId },
            include: {
                mapel: true,
                rombel: {
                    include: {
                        tahun_ajaran: true,
                        _count: { select: { anggota_kelas: true } },
                    },
                },
            },
        });
    },

    // ===================== JADWAL PELAJARAN =====================
    async createJadwal(data: CreateJadwalData) {
        const pengampu = await prisma.pengampuMapel.findUnique({
            where: { id: data.pengampu_mapel_id }
        });
        if (!pengampu) throw new AppError(404, 'Pengampu Mapel tidak ditemukan.');

        return prisma.jadwalPelajaran.create({
            data,
            include: {
                pengampu_mapel: {
                    include: {
                        mapel: true,
                        guru: true,
                        rombel: true
                    }
                }
            }
        });
    },

    async getJadwalByRombel(rombelId: number) {
        return prisma.jadwalPelajaran.findMany({
            where: {
                pengampu_mapel: { rombel_id: rombelId }
            },
            include: {
                pengampu_mapel: {
                    include: {
                        mapel: true,
                        guru: true,
                    }
                }
            },
            orderBy: [
                { hari: 'asc' },
                { jam_mulai: 'asc' }
            ]
        });
    },

    async getJadwalByGuru(guruId: number) {
        return prisma.jadwalPelajaran.findMany({
            where: {
                pengampu_mapel: { guru_id: guruId }
            },
            include: {
                pengampu_mapel: {
                    include: {
                        mapel: true,
                        rombel: true,
                    }
                }
            },
            orderBy: [
                { hari: 'asc' },
                { jam_mulai: 'asc' }
            ]
        });
    },

    async deleteJadwal(id: number) {
        return prisma.jadwalPelajaran.delete({
            where: { id }
        });
    },

    // ===================== PRESENSI =====================
    async inputPresensi(jadwalId: number, tanggal: Date, items: InputPresensiItem[]) {
        const results = await Promise.all(
            items.map((item) =>
                prisma.presensi.upsert({
                    where: {
                        anggota_rombel_id_jadwal_id_tanggal: {
                            anggota_rombel_id: item.anggota_rombel_id,
                            jadwal_id: jadwalId,
                            tanggal,
                        },
                    },
                    update: { status: item.status },
                    create: {
                        anggota_rombel_id: item.anggota_rombel_id,
                        jadwal_id: jadwalId,
                        tanggal,
                        status: item.status,
                    },
                })
            )
        );

        return { count: results.length };
    },

    async getPresensiByJadwal(jadwalId: number, tanggal?: Date) {
        const whereClause: any = {
            jadwal_id: jadwalId
        };
        if (tanggal) {
            whereClause.tanggal = tanggal;
        }

        return prisma.presensi.findMany({
            where: whereClause,
            include: {
                anggota_rombel: {
                    include: { siswa: { select: { id: true, nis: true, nama_lengkap: true } } },
                },
            },
            orderBy: [{ tanggal: 'asc' }, { anggota_rombel: { siswa: { nama_lengkap: 'asc' } } }],
        });
    },

    // ===================== NILAI =====================
    async inputNilai(items: InputNilaiItem[]) {
        const results = await Promise.all(
            items.map((item) =>
                prisma.nilai.upsert({
                    where: {
                        anggota_rombel_id_pengampu_mapel_id_jenis_nilai_urutan: {
                            anggota_rombel_id: item.anggota_rombel_id,
                            pengampu_mapel_id: item.pengampu_mapel_id,
                            jenis_nilai: item.jenis_nilai,
                            urutan: item.urutan,
                        },
                    },
                    update: { skor: item.skor },
                    create: item,
                })
            )
        );

        return { count: results.length };
    },

    async getNilaiByRombelAndMapel(rombelId: number, pengampuMapelId: number) {
        return prisma.nilai.findMany({
            where: {
                anggota_rombel: { rombel_id: rombelId },
                pengampu_mapel_id: pengampuMapelId,
            },
            include: {
                anggota_rombel: {
                    include: { siswa: { select: { id: true, nis: true, nama_lengkap: true } } },
                },
            },
            orderBy: { anggota_rombel: { siswa: { nama_lengkap: 'asc' } } },
        });
    },

    async getRekapNilaiRombel(rombelId: number) {
        const anggota = await prisma.anggotaRombel.findMany({
            where: { rombel_id: rombelId },
            include: {
                siswa: true,
                nilai: {
                    include: {
                        pengampu_mapel: { include: { mapel: true } },
                    },
                },
                presensi: true,
            },
            orderBy: { siswa: { nama_lengkap: 'asc' } },
        });

        return anggota;
    }
};