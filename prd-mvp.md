# Product Requirements Document (PRD) - MVP Sistem Informasi Sekolah
**Konteks untuk AI Coding Assistant**

## 1. Project Overview
Buatlah Sistem Informasi Sekolah berbasis web. Aplikasi ini bertujuan untuk mendigitalkan administrasi sekolah, menggantikan proses manual berbasis Excel. 
Target pengembangan saat ini adalah **Fase 1 (MVP)** yang berfokus pada manajemen data dasar, presensi kelas, dan rekapitulasi nilai (raport).

## 2. Tech Stack yang Diwajibkan
- **Backend:** Node.js, Express.js, TypeScript.
- **Database:** PostgreSQL.
- **ORM:** Prisma.
- **Frontend:** React (Vite), TypeScript.
- **Styling UI:** Tailwind CSS, komponen dari Shadcn UI & Radix UI.
- **State Management & Fetching:** Zustand (Global State), React Query (Data Fetching), Axios.
- **Validasi Data:** Zod (di Frontend dan Backend).

## 3. Aturan Arsitektur (Strict Rules)
1. **Backend Pattern:** Wajib menggunakan pola `Route -> Controller -> Service`. Controller TIDAK BOLEH berisi query database. Semua query Prisma harus berada di dalam `Service`.
2. **API Response:** Semua API harus mengembalikan format JSON yang standar: `{ status: "success" | "error", message: string, data: any }`.
3. **Frontend UI/UX:** Gunakan pendekatan "Mobile-First" untuk halaman Guru (Presensi & Nilai) dan "Desktop-First" untuk halaman Admin TU (CRUD Master Data).
4. **Keamanan:** Gunakan JWT untuk autentikasi. Terapkan Role-Based Access Control (RBAC) di tingkat middleware backend dan route guard frontend.

## 4. Role Pengguna (RBAC)
Hanya ada 3 role pada MVP ini:
- `SUPERADMIN`: Akses penuh.
- `ADMIN_TU`: Mengelola CRUD Master Data, Rombel (Kelas), dan Export Raport massal.
- `GURU`: Hanya bisa melihat kelas yang diampunya, menginput absensi, dan menginput nilai.

## 5. Prisma Database Schema (Acuan Inti)
AI wajib menggunakan struktur relasi berikut sebagai acuan utama pembuatan `schema.prisma`:

- **User:** id, username, password (hashed), role (Enum).
- **Guru:** id, user_id (FK), nip, nama_lengkap, no_hp.
- **Siswa:** id, nis, nisn, nama_lengkap, jenis_kelamin.
- **Mapel (Mata Pelajaran):** id, kode_mapel, nama_mapel.
- **TahunAjaran:** id, nama, semester (Enum), is_active (Boolean - default false, hanya 1 yang true).
- **Rombel (Kelas):** id, tahun_ajaran_id (FK), wali_kelas_id (FK Guru), tingkat, nama_kelas.
- **AnggotaRombel:** id, rombel_id (FK), siswa_id (FK) -> *Pivot mapping siswa ke kelas*.
- **PengampuMapel:** id, guru_id (FK), mapel_id (FK), rombel_id (FK) -> *Pivot mapping guru mengajar apa di kelas mana*.
- **Presensi:** id, anggota_rombel_id (FK), tanggal, status (Enum: HADIR, SAKIT, IZIN, ALPA).
- **Nilai:** id, anggota_rombel_id (FK), pengampu_mapel_id (FK), jenis_nilai (Enum: TUGAS, UTS, UAS), skor.

## 6. Daftar Fitur MVP (Scope of Work)
**Modul Autentikasi:**
- Login dan generate JWT Token.

**Modul Master Data (Admin TU):**
- CRUD Guru, Siswa, Mapel.
- Import Massal data Siswa/Guru via file Excel (.xlsx).
- Seting Tahun Ajaran Aktif.
- Pembagian Kelas (Assign siswa ke Rombel) & penentuan Wali Kelas.

**Modul Akademik (Guru):**
- Lihat jadwal/daftar kelas yang diampu.
- Input Presensi Harian (UI harus memiliki toggle button Hadir/Sakit/Izin/Alpa, default "Hadir").
- Input Nilai (UI spreadsheet-lite).

**Modul Pelaporan (Admin & Wali Kelas):**
- Generate dan Export PDF Raport berdasarkan id_rombel.
