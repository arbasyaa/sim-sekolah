# Aturan Penulisan Kode (Coding Rules) & Best Practices

AI WAJIB mematuhi aturan berikut saat men-generate kode untuk proyek ini. Proyek ini menggunakan TypeScript penuh (Fullstack).

## 1. Aturan Umum (TypeScript)
- **Dilarang menggunakan `any`:** Selalu definisikan tipe data (interface/type) secara eksplisit.
- **Naming Convention:**
  - `camelCase` untuk nama variabel dan fungsi (contoh: `getSiswaData`).
  - `PascalCase` untuk nama Class, Interface, Type, dan Komponen React (contoh: `DataSiswaTable`).
  - `UPPER_SNAKE_CASE` untuk konstanta global (contoh: `MAX_UPLOAD_SIZE`).
- **Modern Syntax:** Wajib menggunakan `async/await` untuk operasi asinkronus, jangan pernah menggunakan `.then().catch()`.

## 2. Aturan Backend (Express.js)
- **Strict Layering (Route -> Controller -> Service):**
  - **Controller:** HANYA bertugas menerima req/res, memanggil validasi Zod, memanggil Service, dan mengirim response JSON. DILARANG menaruh logika bisnis atau query Prisma di sini.
  - **Service:** Tempat semua logika bisnis, kalkulasi, dan interaksi database (Prisma) berada.

**Standar Response API:** 
Semua endpoint wajib mengembalikan struktur JSON berikut melalui helper response:

{
  "status": "success" | "error",
  "message": "Pesan deskriptif",
  "data": { ... } // null jika error
}
Error Handling: Jangan gunakan try-catch di setiap controller secara berulang jika bisa diatasi dengan Global Error Handling Middleware dan Async Wrapper. Lempar error menggunakan custom class (misal: AppError(404, "Siswa tidak ditemukan")).

    Validasi: Gunakan Zod untuk memvalidasi req.body, req.params, dan req.query di tingkat middleware sebelum masuk ke controller.

## 3. Aturan Frontend (React, Vite)
**Data Fetching:** WAJIB menggunakan @tanstack/react-query. Dilarang menggunakan useEffect untuk melakukan pemanggilan API (fetch/axios) secara manual.

**State Management:**
Gunakan Zustand HANYA untuk state global (seperti data user login, tema, atau status sidebar).
Gunakan local state (useState) untuk state komponen.
Form & Validasi: Wajib menggunakan kombinasi react-hook-form dan @hookform/resolvers/zod.
Styling: Gunakan Tailwind CSS. Untuk penggabungan class kondisional yang kompleks, wajib menggunakan utility cn (gabungan clsx dan tailwind-merge).
Kerapian Komponen: Jika sebuah komponen halaman (page) terlalu panjang (lebih dari 150 baris), pecah menjadi komponen UI kecil di dalam folder components/.
