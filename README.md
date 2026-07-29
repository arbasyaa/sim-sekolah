# 🎓 SIM Sekolah (Sistem Informasi Manajemen Sekolah)

SIM Sekolah adalah sebuah aplikasi berbasis web komprehensif yang dirancang untuk mengelola berbagai kebutuhan administrasi dan akademik di lingkungan sekolah. Aplikasi ini mencakup manajemen data master (Guru, Siswa, Mata Pelajaran, Rombongan Belajar, Tahun Ajaran) serta fitur operasional akademik (Jadwal Pelajaran, Presensi/Kehadiran, dan Penilaian).

Proyek ini dibangun menggunakan arsitektur pemisahan *Client-Server* dengan teknologi modern berbasis TypeScript.

---

## 🚀 Fitur Utama (MVP)

1. **Otentikasi & Otorisasi (RBAC)**
   - Login berbasis JWT (JSON Web Token).
   - Multi-role access: `SUPERADMIN`, `GURU`, dan `SISWA`.
2. **Manajemen Data Master (Superadmin)**
   - Kelola Data Tahun Ajaran (Aktif/Non-aktif).
   - Kelola Data Mata Pelajaran (Mapel).
   - Kelola Data Guru dan Siswa.
   - Kelola Rombongan Belajar (Rombel/Kelas) beserta anggotanya (Siswa).
3. **Manajemen Akademik**
   - **Jadwal Pelajaran:** Alokasi mapel dan guru ke dalam rombel.
   - **Kehadiran (Absensi):** Pencatatan presensi siswa oleh guru.
   - **Penilaian:** Pencatatan nilai tugas, UTS, dan UAS siswa.

---

## 🛠️ Teknologi yang Digunakan

### Frontend (`/sekolah-frontend`)
- **Framework:** [React 18](https://react.dev/) dengan [TypeScript](https://www.typescriptlang.org/)
- **Build Tool:** [Vite](https://vitejs.dev/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **State Management:** [Zustand](https://zustand-demo.pmnd.rs/) (Global State) & [TanStack Query / React Query](https://tanstack.com/query/latest) (Server State & Caching)
- **Routing:** [React Router v6](https://reactrouter.com/)
- **HTTP Client:** [Axios](https://axios-http.com/)
- **Icons:** [Lucide React](https://lucide.dev/)

### Backend (`/sekolah-backend`)
- **Runtime:** [Node.js](https://nodejs.org/)
- **Framework:** [Express.js](https://expressjs.com/) dengan [TypeScript](https://www.typescriptlang.org/)
- **ORM:** [Prisma ORM](https://www.prisma.io/)
- **Database:** [PostgreSQL](https://www.postgresql.org/)
- **Security:** `bcryptjs` (Password Hashing), `jsonwebtoken` (Auth)
- **Validation:** `zod`

---

## 📂 Struktur Direktori Proyek

Proyek ini dibagi menjadi dua direktori utama:

```text
sim-sekolah/
├── sekolah-backend/        # Kode sumber untuk REST API Backend (Express + Prisma)
│   ├── prisma/             # Schema database Prisma & file Seed
│   ├── src/                # Source code backend (Controllers, Services, Routes, dll)
│   ├── .env                # Konfigurasi environment backend
│   └── package.json        # Dependencies backend
│
├── sekolah-frontend/       # Kode sumber untuk Antarmuka Pengguna (React + Vite)
│   ├── public/             # Static assets
│   ├── src/                # Source code frontend (Components, Pages, Hooks, Store, dll)
│   ├── .env                # Konfigurasi environment frontend
│   └── package.json        # Dependencies frontend
│
├── coding-rules.md         # Aturan standar penulisan kode proyek
├── prd-mvp.md              # Dokumen Product Requirements Document
├── schema.md               # Dokumentasi struktur database
└── struktur-folder.md      # Panduan struktur folder untuk Frontend & Backend
```

---

## 💻 Panduan Instalasi & Menjalankan Proyek

### Prasyarat
Pastikan sistem Anda telah terinstal:
- **Node.js** (v18 atau lebih baru)
- **PostgreSQL** (Sedang berjalan di background sistem Anda)

### 1. Setup Backend & Database

Buka terminal dan jalankan perintah berikut:

```bash
# Masuk ke direktori backend
cd sekolah-backend

# Install dependencies
npm install

# Buat file .env (jika belum ada) dan sesuaikan dengan konfigurasi database Anda
# Contoh isi .env:
# DATABASE_URL="postgresql://postgres:password@localhost:5432/sim_sekolah?schema=public"
# JWT_SECRET="rahasia-negara-123"

# Jalankan migrasi database untuk membuat tabel
npx prisma migrate dev --name init

# Lakukan seeding untuk membuat akun superadmin dan data awal
npx prisma db seed

# Jalankan server backend (development mode)
npm run dev
```
*Backend akan berjalan di `http://localhost:3000`.*

### 2. Setup Frontend

Buka **terminal baru**, biarkan terminal backend tetap berjalan.

```bash
# Masuk ke direktori frontend
cd sekolah-frontend

# Install dependencies
npm install

# Buat file .env (jika belum ada)
# Contoh isi .env:
# VITE_API_URL=http://localhost:3000/api

# Jalankan server frontend (development mode)
npm run dev
```
*Frontend akan berjalan di `http://localhost:5173` (atau port yang tertera di terminal).*

### 3. Mengelola Database dengan Prisma Studio (Opsional)

Jika Anda ingin melihat atau memanipulasi data database secara visual melalui browser, buka **terminal baru** lagi:

```bash
cd sekolah-backend
npx prisma studio
```
*Prisma Studio akan terbuka di `http://localhost:5555`.*

---

## 🔐 Kredensial Akses Default

Setelah Anda menjalankan perintah `npx prisma db seed`, sistem akan otomatis membuat satu akun `SUPERADMIN` yang dapat Anda gunakan untuk login pertama kali.

- **Role:** Superadmin
- **Username:** `superadmin`
- **Password:** `admin123`

Gunakan akun ini untuk masuk ke dalam aplikasi dan mulai mengelola data Guru, Siswa, dan pengaturan lainnya.

---

## 📚 Panduan Pengembangan (Developer Guidelines)

Bagi pengembang yang ingin berkontribusi atau melanjutkan proyek ini, harap membaca dengan saksama dokumen-dokumen berikut yang berada di *root* folder:

1. **`coding-rules.md`**: Berisi konvensi penamaan (naming conventions), arsitektur, praktik terbaik penanganan error, dan standar keamanan yang harus dipatuhi.
2. **`prd-mvp.md`**: Dokumen spesifikasi kebutuhan bisnis, menjelaskan fitur apa saja yang masuk dalam cakupan Minimum Viable Product.
3. **`struktur-folder.md`**: Menjelaskan pola dan tanggung jawab tiap layer pada *Clean Architecture* di Backend dan *Feature-based/Layered* di Frontend.
4. **`schema.md` & `prisma/schema.prisma`**: Referensi struktur relasi Entity-Relationship (ER) database.

---

## 📜 Lisensi

Proyek ini dibuat untuk keperluan internal manajemen sekolah. Semua hak cipta dilindungi.