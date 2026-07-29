import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // 1. Buat user superadmin
  const hashedPassword = await bcrypt.hash('admin123', 10);
  const superadmin = await prisma.user.upsert({
    where: { username: 'superadmin' },
    update: {},
    create: {
      username: 'superadmin',
      password: hashedPassword,
      role: 'SUPERADMIN',
    },
  });
  console.log(`✅ User superadmin: ${superadmin.username}`);

  // 2. Buat tahun ajaran aktif
  const tahunAjaran = await prisma.tahunAjaran.upsert({
    where: { id: 1 },
    update: {},
    create: {
      nama: '2025/2026',
      semester: 'GANJIL',
      is_active: true,
    },
  });
  console.log(`✅ Tahun ajaran: ${tahunAjaran.nama} - ${tahunAjaran.semester}`);

  // 3. Buat beberapa mapel contoh
  const mapelData = [
    { kode_mapel: 'MTK', nama_mapel: 'Matematika' },
    { kode_mapel: 'BIN', nama_mapel: 'Bahasa Indonesia' },
    { kode_mapel: 'BIG', nama_mapel: 'Bahasa Inggris' },
    { kode_mapel: 'IPA', nama_mapel: 'Ilmu Pengetahuan Alam' },
    { kode_mapel: 'IPS', nama_mapel: 'Ilmu Pengetahuan Sosial' },
  ];

  for (const m of mapelData) {
    await prisma.mapel.upsert({
      where: { kode_mapel: m.kode_mapel },
      update: {},
      create: m,
    });
  }
  console.log(`✅ ${mapelData.length} mapel berhasil diseed`);

  console.log('🎉 Seeding selesai!');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });