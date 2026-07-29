// ===================== ENUMS =====================
export type Role = 'SUPERADMIN' | 'ADMIN_TU' | 'GURU';
export type Semester = 'GANJIL' | 'GENAP';
export type JenisKelamin = 'LAKI_LAKI' | 'PEREMPUAN';
export type StatusPresensi = 'HADIR' | 'SAKIT' | 'IZIN' | 'ALPA';
export type JenisNilai = 'TUGAS' | 'UTS' | 'UAS';

// ===================== API RESPONSE =====================
export interface ApiResponse<T> {
  status: 'success' | 'error';
  message: string;
  data: T;
}

// ===================== AUTH =====================
export interface LoginPayload {
  username: string;
  password: string;
}

export interface LoginData {
  token: string;
  user: UserData;
}

export interface UserData {
  id: number;
  username: string;
  role: Role;
  guru_id?: number | null;
}

// ===================== MASTER DATA =====================
export interface Guru {
  id: number;
  user_id: number | null;
  nip: string;
  nama_lengkap: string;
  no_hp: string | null;
}

export interface Siswa {
  id: number;
  nis: string;
  nisn: string;
  nama_lengkap: string;
  jenis_kelamin: JenisKelamin;
}

export interface Mapel {
  id: number;
  kode_mapel: string;
  nama_mapel: string;
}

export interface TahunAjaran {
  id: number;
  nama: string;
  semester: Semester;
  is_active: boolean;
}

// ===================== AKADEMIK =====================
export interface Rombel {
  id: number;
  tahun_ajaran_id: number;
  wali_kelas_id: number;
  tingkat: number;
  nama_kelas: string;
  tahun_ajaran?: TahunAjaran;
  wali_kelas?: Guru;
  anggota_kelas?: AnggotaRombel[];
}

export interface AnggotaRombel {
  id: number;
  rombel_id: number;
  siswa_id: number;
  siswa?: Siswa;
}

export interface PengampuMapel {
  id: number;
  guru_id: number;
  mapel_id: number;
  rombel_id: number;
  guru?: Guru;
  mapel?: Mapel;
  rombel?: Rombel;
}

export interface Presensi {
  id: number;
  anggota_rombel_id: number;
  tanggal: string;
  status: StatusPresensi;
  anggota_rombel?: AnggotaRombel;
}

export interface Nilai {
  id: number;
  anggota_rombel_id: number;
  pengampu_mapel_id: number;
  jenis_nilai: JenisNilai;
  urutan: number;
  skor: number;
  anggota_rombel?: AnggotaRombel;
  pengampu_mapel?: PengampuMapel;
}
