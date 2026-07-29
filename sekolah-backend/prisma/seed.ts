import { PrismaClient, JenisNilai } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Memulai proses seeding database (Optimized for Integration)...');

  // ============================================================================
  // 0. CLEANUP (Hapus data lama agar tidak duplikat saat di-seed ulang)
  // ============================================================================
  console.log('🧹 Membersihkan data lama...');
  await prisma.nilai.deleteMany();
  await prisma.presensi.deleteMany();
  await prisma.pengampuMapel.deleteMany();
  await prisma.anggotaRombel.deleteMany();
  await prisma.rombel.deleteMany();
  await prisma.siswa.deleteMany();
  await prisma.guru.deleteMany();
  // Tidak menghapus user superadmin agar tetap bisa login

  // ============================================================================
  // 1. SUPERADMIN & TAHUN AJARAN
  // ============================================================================
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

  // ============================================================================
  // 2. MAPEL (5 Mata Pelajaran)
  // ============================================================================
  const mapelData = [
    { kode_mapel: 'MTK', nama_mapel: 'Matematika' },
    { kode_mapel: 'BIN', nama_mapel: 'Bahasa Indonesia' },
    { kode_mapel: 'BIG', nama_mapel: 'Bahasa Inggris' },
    { kode_mapel: 'IPA', nama_mapel: 'Ilmu Pengetahuan Alam' },
    { kode_mapel: 'IPS', nama_mapel: 'Ilmu Pengetahuan Sosial' },
  ];

  const createdMapels = [];
  for (const m of mapelData) {
    const mapel = await prisma.mapel.upsert({
      where: { kode_mapel: m.kode_mapel },
      update: {},
      create: m,
    });
    createdMapels.push(mapel);
  }
  console.log(`✅ ${createdMapels.length} Mapel berhasil dibuat`);

  // ============================================================================
  // 3. GURU (5 Guru untuk masing-masing Mapel)
  // ============================================================================
  const guruPassword = await bcrypt.hash('guru123', 10);
  const guruList = [
    { username: 'guru_mtk', nip: '10001', nama: 'Ahmad Matematika, S.Pd' },
    { username: 'guru_bin', nip: '10002', nama: 'Siti Bahasa, S.Pd' },
    { username: 'guru_big', nip: '10003', nama: 'Budi English, S.Pd' },
    { username: 'guru_ipa', nip: '10004', nama: 'Desi Sains, S.Si' },
    { username: 'guru_ips', nip: '10005', nama: 'Eko Sosial, S.Pd' },
  ];

  const createdGurus = [];
  for (const g of guruList) {
    const userGuru = await prisma.user.upsert({
      where: { username: g.username },
      update: {},
      create: { username: g.username, password: guruPassword, role: 'GURU' },
    });

    const guru = await prisma.guru.create({
      data: {
        nip: g.nip,
        nama_lengkap: g.nama,
        no_hp: `0812000${g.nip}`,
        user_id: userGuru.id,
      },
    });
    createdGurus.push(guru);
  }
  console.log(`✅ ${createdGurus.length} Guru berhasil dibuat (Password: guru123)`);

  // ============================================================================
  // 4. ROMBEL (9 Kelas: X A-C, XI A-C, XII A-C)
  // ============================================================================
  const rombelNames = [
    { nama: 'X A', tingkat: 10 }, { nama: 'X B', tingkat: 10 }, { nama: 'X C', tingkat: 10 },
    { nama: 'XI A', tingkat: 11 }, { nama: 'XI B', tingkat: 11 }, { nama: 'XI C', tingkat: 11 },
    { nama: 'XII A', tingkat: 12 }, { nama: 'XII B', tingkat: 12 }, { nama: 'XII C', tingkat: 12 },
  ];

  const createdRombels = [];
  for (let i = 0; i < rombelNames.length; i++) {
    // Wali kelas diacak dari 5 guru yang ada
    const waliKelas = createdGurus[i % createdGurus.length]; 
    const rombel = await prisma.rombel.create({
      data: {
        nama_kelas: rombelNames[i].nama,
        tingkat: rombelNames[i].tingkat,
        tahun_ajaran_id: tahunAjaran.id,
        wali_kelas_id: waliKelas.id,
      },
    });
    createdRombels.push(rombel);
  }
  console.log(`✅ ${createdRombels.length} Rombel (X, XI, XII) berhasil dibuat`);

  // ============================================================================
  // 5. SISWA & ANGGOTA ROMBEL (45 Siswa, 5 per Kelas)
  // ============================================================================
  const createdAnggotaRombels = [];
  let siswaCounter = 1;

  for (const rombel of createdRombels) {
    for (let i = 1; i <= 5; i++) {
      const nis = `2026${String(siswaCounter).padStart(3, '0')}`;
      const siswa = await prisma.siswa.create({
        data: {
          nis: nis,
          nisn: `00${nis}`,
          nama_lengkap: `Siswa ${rombel.nama_kelas} - ${i}`,
          jenis_kelamin: i % 2 === 0 ? 'P' : 'L',
        }
      });

      const anggota = await prisma.anggotaRombel.create({
        data: {
          rombel_id: rombel.id,
          siswa_id: siswa.id,
        }
      });
      createdAnggotaRombels.push(anggota);
      siswaCounter++;
    }
  }
  console.log(`✅ ${siswaCounter - 1} Siswa berhasil dibuat dan dimasukkan ke kelas`);

  // ============================================================================
  // 6. PENGAMPU MAPEL (Semua Mapel diajarkan di Semua Kelas)
  // ============================================================================
  const createdPengampuMapels = [];
  for (const rombel of createdRombels) {
    for (let i = 0; i < createdMapels.length; i++) {
      const mapel = createdMapels[i];
      const guru = createdGurus[i]; // guru_mtk -> MTK, guru_bin -> BIN, dsb.

      const pengampu = await prisma.pengampuMapel.create({
        data: {
          rombel_id: rombel.id,
          mapel_id: mapel.id,
          guru_id: guru.id,
        }
      });
      createdPengampuMapels.push(pengampu);
    }
  }
  console.log(`✅ ${createdPengampuMapels.length} Data Pengampu Mapel (Jadwal) berhasil dibuat`);

  // ============================================================================
  // 7. SEEDING NILAI (5 Tugas, 1 UTS, 1 UAS untuk setiap siswa x mapel)
  // ============================================================================
  console.log('⏳ Generating nilai...');
  const nilaiToInsert = [];

  for (const anggota of createdAnggotaRombels) {
    // Cari semua pengampu mapel di rombel siswa ini
    const pengampuList = createdPengampuMapels.filter(p => p.rombel_id === anggota.rombel_id);

    for (const pengampu of pengampuList) {
      // 5 Tugas
      for (let t = 1; t <= 5; t++) {
        nilaiToInsert.push({
          anggota_rombel_id: anggota.id,
          pengampu_mapel_id: pengampu.id,
          jenis_nilai: JenisNilai.TUGAS,
          urutan: t,
          skor: Math.floor(Math.random() * 31) + 70, // Random 70 - 100
        });
      }
      
      // 1 UTS
      nilaiToInsert.push({
        anggota_rombel_id: anggota.id,
        pengampu_mapel_id: pengampu.id,
        jenis_nilai: JenisNilai.UTS,
        urutan: 1,
        skor: Math.floor(Math.random() * 31) + 70,
      });

      // 1 UAS
      nilaiToInsert.push({
        anggota_rombel_id: anggota.id,
        pengampu_mapel_id: pengampu.id,
        jenis_nilai: JenisNilai.UAS,
        urutan: 1,
        skor: Math.floor(Math.random() * 31) + 70,
      });
    }
  }

  // Insert bulk nilai
  const chunkSize = 1000;
  for (let i = 0; i < nilaiToInsert.length; i += chunkSize) {
    const chunk = nilaiToInsert.slice(i, i + chunkSize);
    await prisma.nilai.createMany({
      data: chunk,
      skipDuplicates: true,
    });
  }
  console.log(`✅ ${nilaiToInsert.length} Record Nilai berhasil dibuat (5 Tugas, 1 UTS, 1 UAS per Siswa/Mapel)`);

  console.log('🎉 Seeding Selesai!');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });