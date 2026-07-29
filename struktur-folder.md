# Struktur Direktori Proyek Sistem Informasi Sekolah

Proyek ini menggunakan arsitektur decoupled (terpisah antara Frontend dan Backend). 
AI harus mengikuti struktur folder ini dengan ketat saat men-generate kode.

## 1. Backend (Node.js, Express, TypeScript, Prisma)
Lokasi: `/sekolah-backend`

sekolah-backend/
├── prisma/
│   └── schema.prisma         # Definisi skema database PostgreSQL
├── src/
│   ├── controllers/          # Layer 2: Menangani Request, Response, dan HTTP Status
│   │   ├── auth.controller.ts
│   │   ├── master.controller.ts  # Guru, Siswa, Mapel
│   │   └── akademik.controller.ts # Presensi, Nilai, Rombel
│   ├── services/             # Layer 3: Logika bisnis dan query DB (Prisma)
│   │   ├── auth.service.ts
│   │   ├── master.service.ts
│   │   └── akademik.service.ts
│   ├── routes/               # Layer 1: Definisi endpoint (URL) & routing
│   │   ├── auth.routes.ts
│   │   ├── master.routes.ts
│   │   ├── akademik.routes.ts
│   │   └── index.ts          # Menggabungkan semua routes
│   ├── middlewares/          # Pengecekan sebelum masuk controller
│   │   ├── auth.middleware.ts  # Verifikasi JWT token & RBAC (Role)
│   │   └── error.middleware.ts # Global error handler
│   ├── utils/                # Fungsi bantuan (Helpers)
│   │   ├── pdfGenerator.ts   # Logika pembuat raport PDF (contoh: pdfmake)
│   │   ├── excelExport.ts    # Logika export Excel (contoh: exceljs)
│   │   └── response.ts       # Standarisasi format JSON response
│   └── app.ts                # Inisialisasi Express app & middleware global
├── .env                      # Kredensial database & JWT Secret (Di-ignore di Git)
├── package.json
└── tsconfig.json             # Konfigurasi TypeScript

## 2. Frontend (React, Vite, TypeScript, Tailwind CSS)
Lokasi: `/sekolah-frontend`

sekolah-frontend/
├── src/
│   ├── assets/               # Gambar, logo, font
│   ├── components/           # Komponen UI Reusable
│   │   ├── ui/               # Komponen dari Shadcn UI (button, input, table, dll)
│   │   └── layout/           # Sidebar, Navbar, PageContainer
│   ├── hooks/                # Custom React Hooks
│   ├── lib/                  # Konfigurasi library eksternal (axios, react-query)
│   │   ├── axios.ts          # Setup interceptor axios (attach JWT token)
│   │   └── utils.ts          # Helper styling (clsx, tailwind-merge)
│   ├── pages/                # Komponen Halaman (Berdasarkan Routing)
│   │   ├── auth/             # Login page
│   │   ├── admin/            # Dashboard Admin & Master Data
│   │   └── guru/             # Dashboard Guru, Input Nilai & Presensi
│   ├── routes/               # Konfigurasi React Router
│   ├── store/                # State management global (Zustand)
│   │   └── authStore.ts      # Menyimpan data user & token saat login
│   ├── types/                # Definisi Type/Interface TypeScript
│   └── main.tsx              # Entry point aplikasi
├── index.html
├── tailwind.config.js        # Konfigurasi styling
├── vite.config.ts
└── package.json
