-- CreateEnum
CREATE TYPE "Role" AS ENUM ('SUPERADMIN', 'ADMIN_TU', 'GURU');

-- CreateEnum
CREATE TYPE "JenisKelamin" AS ENUM ('L', 'P');

-- CreateEnum
CREATE TYPE "Semester" AS ENUM ('GANJIL', 'GENAP');

-- CreateEnum
CREATE TYPE "StatusPresensi" AS ENUM ('HADIR', 'SAKIT', 'IZIN', 'ALPA');

-- CreateEnum
CREATE TYPE "JenisNilai" AS ENUM ('TUGAS', 'UTS', 'UAS');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Guru" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER,
    "nip" TEXT,
    "nama_lengkap" TEXT NOT NULL,
    "no_hp" TEXT,

    CONSTRAINT "Guru_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Siswa" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER,
    "nis" TEXT NOT NULL,
    "nisn" TEXT NOT NULL,
    "nama_lengkap" TEXT NOT NULL,
    "jenis_kelamin" "JenisKelamin" NOT NULL,

    CONSTRAINT "Siswa_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Mapel" (
    "id" SERIAL NOT NULL,
    "kode_mapel" TEXT NOT NULL,
    "nama_mapel" TEXT NOT NULL,

    CONSTRAINT "Mapel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TahunAjaran" (
    "id" SERIAL NOT NULL,
    "nama" TEXT NOT NULL,
    "semester" "Semester" NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "TahunAjaran_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Rombel" (
    "id" SERIAL NOT NULL,
    "tahun_ajaran_id" INTEGER NOT NULL,
    "wali_kelas_id" INTEGER NOT NULL,
    "tingkat" INTEGER NOT NULL,
    "nama_kelas" TEXT NOT NULL,

    CONSTRAINT "Rombel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AnggotaRombel" (
    "id" SERIAL NOT NULL,
    "rombel_id" INTEGER NOT NULL,
    "siswa_id" INTEGER NOT NULL,

    CONSTRAINT "AnggotaRombel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PengampuMapel" (
    "id" SERIAL NOT NULL,
    "guru_id" INTEGER NOT NULL,
    "mapel_id" INTEGER NOT NULL,
    "rombel_id" INTEGER NOT NULL,

    CONSTRAINT "PengampuMapel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Presensi" (
    "id" SERIAL NOT NULL,
    "anggota_rombel_id" INTEGER NOT NULL,
    "tanggal" DATE NOT NULL,
    "status" "StatusPresensi" NOT NULL,

    CONSTRAINT "Presensi_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Nilai" (
    "id" SERIAL NOT NULL,
    "anggota_rombel_id" INTEGER NOT NULL,
    "pengampu_mapel_id" INTEGER NOT NULL,
    "jenis_nilai" "JenisNilai" NOT NULL,
    "skor" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Nilai_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Guru_user_id_key" ON "Guru"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "Guru_nip_key" ON "Guru"("nip");

-- CreateIndex
CREATE UNIQUE INDEX "Siswa_user_id_key" ON "Siswa"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "Siswa_nis_key" ON "Siswa"("nis");

-- CreateIndex
CREATE UNIQUE INDEX "Siswa_nisn_key" ON "Siswa"("nisn");

-- CreateIndex
CREATE UNIQUE INDEX "Mapel_kode_mapel_key" ON "Mapel"("kode_mapel");

-- CreateIndex
CREATE UNIQUE INDEX "AnggotaRombel_rombel_id_siswa_id_key" ON "AnggotaRombel"("rombel_id", "siswa_id");

-- CreateIndex
CREATE UNIQUE INDEX "PengampuMapel_mapel_id_rombel_id_key" ON "PengampuMapel"("mapel_id", "rombel_id");

-- CreateIndex
CREATE UNIQUE INDEX "Presensi_anggota_rombel_id_tanggal_key" ON "Presensi"("anggota_rombel_id", "tanggal");

-- AddForeignKey
ALTER TABLE "Guru" ADD CONSTRAINT "Guru_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Siswa" ADD CONSTRAINT "Siswa_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rombel" ADD CONSTRAINT "Rombel_tahun_ajaran_id_fkey" FOREIGN KEY ("tahun_ajaran_id") REFERENCES "TahunAjaran"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rombel" ADD CONSTRAINT "Rombel_wali_kelas_id_fkey" FOREIGN KEY ("wali_kelas_id") REFERENCES "Guru"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnggotaRombel" ADD CONSTRAINT "AnggotaRombel_rombel_id_fkey" FOREIGN KEY ("rombel_id") REFERENCES "Rombel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnggotaRombel" ADD CONSTRAINT "AnggotaRombel_siswa_id_fkey" FOREIGN KEY ("siswa_id") REFERENCES "Siswa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PengampuMapel" ADD CONSTRAINT "PengampuMapel_guru_id_fkey" FOREIGN KEY ("guru_id") REFERENCES "Guru"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PengampuMapel" ADD CONSTRAINT "PengampuMapel_mapel_id_fkey" FOREIGN KEY ("mapel_id") REFERENCES "Mapel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PengampuMapel" ADD CONSTRAINT "PengampuMapel_rombel_id_fkey" FOREIGN KEY ("rombel_id") REFERENCES "Rombel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Presensi" ADD CONSTRAINT "Presensi_anggota_rombel_id_fkey" FOREIGN KEY ("anggota_rombel_id") REFERENCES "AnggotaRombel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Nilai" ADD CONSTRAINT "Nilai_anggota_rombel_id_fkey" FOREIGN KEY ("anggota_rombel_id") REFERENCES "AnggotaRombel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Nilai" ADD CONSTRAINT "Nilai_pengampu_mapel_id_fkey" FOREIGN KEY ("pengampu_mapel_id") REFERENCES "PengampuMapel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
