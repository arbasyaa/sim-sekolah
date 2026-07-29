import { useState, useEffect, useMemo } from 'react';
import { useAuthStore } from '@/store/authStore';
import { usePengampuGuru, useRombelById, useNilaiRombel, useInputNilai, useRekapRaport } from '@/hooks/useAkademikData';
import type { JenisNilai } from '@/types';
import { X, Printer } from 'lucide-react';

const CetakRekapAkhirDocument = ({ studentData, rombelName }: any) => {
  if (!studentData) return null;

  // Process Mapel Nilai
  const mapelMap = new Map<number, any>();
  studentData.nilai?.forEach((n: any) => {
    const mapelId = n.pengampu_mapel?.mapel_id;
    if (!mapelId) return;

    if (!mapelMap.has(mapelId)) {
      mapelMap.set(mapelId, {
        nama_mapel: n.pengampu_mapel.mapel.nama_mapel,
        tugasList: [],
        nilai_uts: 0,
        nilai_uas: 0,
      });
    }

    const mapelObj = mapelMap.get(mapelId);
    if (n.jenis_nilai === 'TUGAS') mapelObj.tugasList.push(n.skor);
    if (n.jenis_nilai === 'UTS') mapelObj.nilai_uts = n.skor;
    if (n.jenis_nilai === 'UAS') mapelObj.nilai_uas = n.skor;
  });

  const mapelList = Array.from(mapelMap.values()).map((m: any) => {
    const avgTugas = m.tugasList.length > 0
      ? Math.round(m.tugasList.reduce((a: number, b: number) => a + b, 0) / m.tugasList.length)
      : 0;
    const akhir = Math.round((avgTugas * 0.2) + (m.nilai_uts * 0.3) + (m.nilai_uas * 0.5));
    return {
      ...m,
      nilai_tugas: avgTugas,
      akhir
    };
  });

  return (
      <div className="print-only p-10 bg-white text-black font-sans w-[210mm] min-h-[297mm] mx-auto">
          <div className="text-center mb-8 border-b-2 border-black pb-4">
              <h1 className="text-2xl font-bold uppercase">Rekap Nilai Akhir Siswa</h1>
              <h2 className="text-xl font-bold">SMA BINA NUSANTARA</h2>
          </div>
          
          <div className="flex justify-between mb-8 text-sm">
              <table className="w-1/2">
                  <tbody>
                      <tr><td className="w-32 py-1">Nama Siswa</td><td className="w-4">:</td><td className="font-bold">{studentData.siswa?.nama_lengkap}</td></tr>
                      <tr><td className="w-32 py-1">NIS / NISN</td><td>:</td><td>{studentData.siswa?.nis} / {studentData.siswa?.nisn}</td></tr>
                  </tbody>
              </table>
              <table className="w-1/2">
                  <tbody>
                      <tr><td className="w-32 py-1">Kelas</td><td className="w-4">:</td><td>{rombelName}</td></tr>
                  </tbody>
              </table>
          </div>

          <table className="w-full border-collapse border border-black text-sm mb-8">
              <thead>
                  <tr className="bg-gray-100">
                      <th className="border border-black px-2 py-2 text-left">Mata Pelajaran</th>
                      <th className="border border-black px-2 py-2 text-center w-24">Rata-rata Tugas</th>
                      <th className="border border-black px-2 py-2 text-center w-20">UTS</th>
                      <th className="border border-black px-2 py-2 text-center w-20">UAS</th>
                      <th className="border border-black px-2 py-2 text-center w-24">Nilai Akhir</th>
                  </tr>
              </thead>
              <tbody>
                  {mapelList.map((m: any, i: number) => (
                  <tr key={i}>
                       <td className="border border-black px-2 py-2">{m.nama_mapel}</td>
                       <td className="border border-black px-2 py-2 text-center">{m.nilai_tugas}</td>
                       <td className="border border-black px-2 py-2 text-center">{m.nilai_uts}</td>
                       <td className="border border-black px-2 py-2 text-center">{m.nilai_uas}</td>
                       <td className="border border-black px-2 py-2 text-center font-bold bg-gray-100">{m.akhir}</td>
                  </tr>
                  ))}
                  {mapelList.length === 0 && (
                      <tr>
                          <td colSpan={5} className="border border-black px-2 py-2 text-center">Belum ada data nilai</td>
                      </tr>
                  )}
              </tbody>
          </table>
      </div>
  )
}

const CetakMapelDocument = ({ student, pengampu, nilaiData, maxTugas }: any) => {
  if (!student || !pengampu) return null;
  
  const studentNilai = nilaiData?.filter((n: any) => n.anggota_rombel_id === student.id) || [];
  const tugasList = studentNilai.filter((n: any) => n.jenis_nilai === 'TUGAS');
  
  const sum = tugasList.reduce((acc: number, curr: any) => acc + curr.skor, 0);
  const avgTugas = tugasList.length > 0 ? Math.round(sum / tugasList.length) : 0;
  
  const uts = studentNilai.find((n: any) => n.jenis_nilai === 'UTS')?.skor || 0;
  const uas = studentNilai.find((n: any) => n.jenis_nilai === 'UAS')?.skor || 0;
  const akhir = Math.round((avgTugas * 0.2) + (uts * 0.3) + (uas * 0.5));

  return (
      <div className="print-only p-10 bg-white text-black font-sans w-[210mm] min-h-[297mm] mx-auto">
          <div className="text-center mb-8 border-b-2 border-black pb-4">
              <h1 className="text-2xl font-bold uppercase">Laporan Nilai Mata Pelajaran</h1>
              <h2 className="text-xl font-bold">SMA BINA NUSANTARA</h2>
          </div>
          
          <div className="flex justify-between mb-8 text-sm">
              <table className="w-1/2">
                  <tbody>
                      <tr><td className="w-32 py-1">Nama Siswa</td><td className="w-4">:</td><td className="font-bold">{student.siswa?.nama_lengkap}</td></tr>
                      <tr><td className="w-32 py-1">NIS / NISN</td><td>:</td><td>{student.siswa?.nis} / {student.siswa?.nisn}</td></tr>
                  </tbody>
              </table>
              <table className="w-1/2">
                  <tbody>
                      <tr><td className="w-32 py-1">Kelas</td><td className="w-4">:</td><td>{pengampu.rombel?.nama_kelas}</td></tr>
                      <tr><td className="w-32 py-1">Mata Pelajaran</td><td>:</td><td>{pengampu.mapel?.nama_mapel}</td></tr>
                  </tbody>
              </table>
          </div>

          <table className="w-full border-collapse border border-black text-sm mb-8">
              <thead>
                  <tr className="bg-gray-100">
                      {[...Array(maxTugas)].map((_, i) => (
                         <th key={i} className="border border-black px-2 py-2">Tugas {i+1}</th>
                      ))}
                      <th className="border border-black px-2 py-2">Rata-rata Tugas</th>
                      <th className="border border-black px-2 py-2">UTS</th>
                      <th className="border border-black px-2 py-2">UAS</th>
                      <th className="border border-black px-2 py-2">Nilai Akhir</th>
                  </tr>
              </thead>
              <tbody>
                  <tr>
                       {[...Array(maxTugas)].map((_, i) => {
                           const n = tugasList.find((t: any) => t.urutan === i + 1);
                           return <td key={i} className="border border-black px-2 py-2 text-center">{n?.skor || '-'}</td>
                       })}
                       <td className="border border-black px-2 py-2 text-center">{avgTugas}</td>
                       <td className="border border-black px-2 py-2 text-center">{uts}</td>
                       <td className="border border-black px-2 py-2 text-center">{uas}</td>
                       <td className="border border-black px-2 py-2 text-center font-bold bg-gray-100">{akhir}</td>
                  </tr>
              </tbody>
          </table>
      </div>
  )
}

export default function NilaiPage() {
  const user = useAuthStore((state) => state.user);
  
  const [selectedRombelId, setSelectedRombelId] = useState<number | ''>('');
  const [selectedPengampuId, setSelectedPengampuId] = useState<number | ''>('');
  const [jenisNilai, setJenisNilai] = useState<JenisNilai>('TUGAS');
  const [urutan, setUrutan] = useState<number>(1);
  const [maxTugas, setMaxTugas] = useState<number>(1);
  const [showModalAkhir, setShowModalAkhir] = useState(false);
  const [selectedRombelForModal, setSelectedRombelForModal] = useState<number | ''>('');
  const [selectedStudentForModal, setSelectedStudentForModal] = useState<number | ''>('');
  const [selectedStudentForPrint, setSelectedStudentForPrint] = useState<any>(null);

  const { data: pengampuList } = usePengampuGuru(user?.guru_id);

  // Derive unique Rombels for Dropdown 1
  const uniqueRombels = useMemo(() => {
    if (!pengampuList) return [];
    const map = new Map<number, any>();
    pengampuList.forEach(p => {
      if (p.rombel && !map.has(p.rombel_id)) {
        map.set(p.rombel_id, p.rombel);
      }
    });
    return Array.from(map.values());
  }, [pengampuList]);

  // Derive Mapels based on selected Rombel for Dropdown 2
  const filteredMapels = useMemo(() => {
    if (!pengampuList || !selectedRombelId) return [];
    return pengampuList.filter(p => p.rombel_id === selectedRombelId);
  }, [pengampuList, selectedRombelId]);

  useEffect(() => {
    setSelectedPengampuId('');
  }, [selectedRombelId]);

  const selectedPengampu = pengampuList?.find((p) => p.id === selectedPengampuId);
  const rombelId = selectedRombelId === '' ? null : selectedRombelId;

  const { data: rombel, isLoading: isLoadingRombel } = useRombelById(rombelId);
  const { data: nilaiData, isLoading: isLoadingNilai } = useNilaiRombel(rombelId, selectedPengampuId === '' ? null : selectedPengampuId);
  
  const rekapRombelId = showModalAkhir ? (selectedRombelForModal === '' ? null : selectedRombelForModal) : null;
  const { data: rekapData } = useRekapRaport(rekapRombelId);

  // Reset states when subject or type changes
  useEffect(() => {
    setUrutan(1);
    setMaxTugas(1);
  }, [selectedPengampuId, jenisNilai]);

  // When nilaiData changes, update maxTugas dynamically
  useEffect(() => {
    if (nilaiData && jenisNilai === 'TUGAS') {
      const tugasUrutan = nilaiData.filter(n => n.jenis_nilai === 'TUGAS').map(n => n.urutan);
      if (tugasUrutan.length > 0) {
        setMaxTugas(prev => Math.max(...tugasUrutan, prev));
      }
    }
  }, [nilaiData, jenisNilai]);

  const handleTambahTugas = () => {
    const nextTugas = maxTugas + 1;
    setMaxTugas(nextTugas);
    setUrutan(nextTugas);
  };

  const handleKurangiTugas = () => {
    if (maxTugas > 1) {
      const nextTugas = maxTugas - 1;
      setMaxTugas(nextTugas);
      if (urutan > nextTugas) setUrutan(nextTugas);
    }
  };

  const { mutate: inputNilai, isPending } = useInputNilai();

  // Local state for nilai form
  const [nilaiForm, setNilaiForm] = useState<Record<number, string>>({});

  // Sync with fetched data
  useEffect(() => {
    if (rombel?.anggota_kelas) {
      const newForm: Record<number, string> = {};
      rombel.anggota_kelas.forEach((a) => {
        const existing = nilaiData?.find(
          (n) => n.anggota_rombel_id === a.id && n.jenis_nilai === jenisNilai && n.urutan === urutan
        );
        newForm[a.id] = existing ? existing.skor.toString() : ''; 
      });
      setNilaiForm(newForm);
    }
  }, [rombel, nilaiData, jenisNilai, urutan]);

  const handleScoreChange = (anggotaId: number, score: string) => {
    // allow empty string or numbers only
    if (score === '' || /^\d+$/.test(score)) {
      const num = parseInt(score);
      if (score === '' || (num >= 0 && num <= 100)) {
        setNilaiForm((prev) => ({
          ...prev,
          [anggotaId]: score,
        }));
      }
    }
  };

  const handleSave = () => {
    if (selectedPengampuId === '' || !rombelId) return;
    
    // Only save those that have valid scores
    const nilaiToSave = Object.entries(nilaiForm)
      .filter(([_, skor]) => skor !== '')
      .map(([id, skor]) => ({
        anggota_rombel_id: Number(id),
        skor: Number(skor),
      }));

    if (nilaiToSave.length === 0) {
      alert('Tidak ada nilai yang diinputkan.');
      return;
    }

    const payload = {
      rombel_id: rombelId,
      pengampu_mapel_id: selectedPengampuId,
      jenis_nilai: jenisNilai,
      urutan: urutan,
      nilai: nilaiToSave,
    };

    inputNilai(payload, {
      onSuccess: () => {
        alert('Nilai berhasil disimpan');
      },
      onError: (err: any) => {
        alert(err.response?.data?.message || 'Gagal menyimpan nilai');
      },
    });
  };

  if (!user?.guru_id) {
    return (
      <div className="p-4 bg-red-50 text-red-600 rounded">
        Halaman ini hanya dapat diakses oleh Guru yang memiliki ID Guru.
      </div>
    );
  }

  return (
    <div className="space-y-6 print-hide">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Input Nilai Siswa</h1>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 items-end flex-wrap">
        <div className="flex-1 min-w-[200px]">
          <label className="block text-sm font-medium text-gray-700 mb-1">Kelas</label>
          <select
            className="w-full border border-gray-300 rounded px-3 py-2"
            value={selectedRombelId}
            onChange={(e) => setSelectedRombelId(e.target.value ? Number(e.target.value) : '')}
          >
            <option value="">-- Pilih Kelas --</option>
            {uniqueRombels.map((r) => (
              <option key={r.id} value={r.id}>
                {r.nama_kelas}
              </option>
            ))}
          </select>
        </div>
        <div className="flex-1 min-w-[200px]">
          <label className="block text-sm font-medium text-gray-700 mb-1">Mata Pelajaran</label>
          <select
            className="w-full border border-gray-300 rounded px-3 py-2"
            value={selectedPengampuId}
            onChange={(e) => setSelectedPengampuId(e.target.value ? Number(e.target.value) : '')}
            disabled={!selectedRombelId}
          >
            <option value="">-- Pilih Mapel --</option>
            {filteredMapels.map((p) => (
              <option key={p.id} value={p.id}>
                {p.mapel?.nama_mapel}
              </option>
            ))}
          </select>
        </div>
        <div className="flex-1 min-w-[200px]">
          <label className="block text-sm font-medium text-gray-700 mb-1">Jenis Nilai</label>
          <select
            className="w-full border border-gray-300 rounded px-3 py-2"
            value={jenisNilai}
            onChange={(e) => setJenisNilai(e.target.value as JenisNilai)}
          >
            <option value="TUGAS">Tugas</option>
            <option value="UTS">UTS</option>
            <option value="UAS">UAS</option>
          </select>
        </div>
        {jenisNilai === 'TUGAS' && (
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Tugas Ke-</label>
            <div className="flex gap-2">
              <select
                className="flex-1 border border-gray-300 rounded px-3 py-2"
                value={urutan}
                onChange={(e) => setUrutan(Number(e.target.value))}
              >
                {[...Array(maxTugas)].map((_, i) => (
                  <option key={i + 1} value={i + 1}>
                    Tugas {i + 1}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={handleKurangiTugas}
                disabled={maxTugas <= 1}
                className="px-3 py-2 bg-red-50 text-red-700 border border-red-200 rounded hover:bg-red-100 whitespace-nowrap text-sm font-medium transition-colors disabled:opacity-50"
              >
                - Kurangi Tugas
              </button>
              <button
                type="button"
                onClick={handleTambahTugas}
                className="px-3 py-2 bg-green-50 text-green-700 border border-green-200 rounded hover:bg-green-100 whitespace-nowrap text-sm font-medium transition-colors"
              >
                + Tambah Tugas
              </button>
            </div>
          </div>
        )}
      </div>

      {selectedPengampuId !== '' && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
          {(isLoadingRombel || isLoadingNilai) ? (
            <div className="p-8 text-center text-gray-500">Memuat data siswa...</div>
          ) : rombel?.anggota_kelas?.length === 0 ? (
            <div className="p-8 text-center text-gray-500">Belum ada siswa di kelas ini.</div>
          ) : (
            <>
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="px-6 py-3 text-sm font-semibold text-gray-600 w-16">No</th>
                    <th className="px-6 py-3 text-sm font-semibold text-gray-600">NIS / NISN</th>
                    <th className="px-6 py-3 text-sm font-semibold text-gray-600">Nama Siswa</th>
                    <th className="px-6 py-3 text-sm font-semibold text-gray-600 w-48">Skor (0-100)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {rombel?.anggota_kelas?.map((anggota, index) => (
                    <tr key={anggota.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-600">{index + 1}</td>
                      <td className="px-6 py-4 text-sm text-gray-800">
                        {anggota.siswa?.nis} / {anggota.siswa?.nisn}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-800">
                        {anggota.siswa?.nama_lengkap}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        <input
                          type="text"
                          className="w-full border border-gray-300 rounded px-3 py-1 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                          placeholder="Kosong"
                          value={nilaiForm[anggota.id] || ''}
                          onChange={(e) => handleScoreChange(anggota.id, e.target.value)}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="p-6 border-t border-gray-200 flex justify-between items-center">
                <button
                  onClick={() => {
                    setSelectedRombelForModal(selectedRombelId);
                    setSelectedStudentForModal('');
                    setShowModalAkhir(true);
                  }}
                  className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 px-6 py-2 rounded font-medium transition-colors"
                >
                  Lihat Nilai Akhir
                </button>
                <button
                  onClick={handleSave}
                  disabled={isPending}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded font-medium disabled:opacity-50"
                >
                  {isPending ? 'Menyimpan...' : 'Simpan Nilai'}
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {/* MODAL NILAI AKHIR */}
      {showModalAkhir && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
              <h2 className="text-lg font-bold text-gray-800">
                Rekap Nilai Akhir Per Siswa
              </h2>
              <button 
                onClick={() => setShowModalAkhir(false)}
                className="p-1 hover:bg-gray-200 rounded text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 overflow-y-auto flex-1">
              <div className="mb-6 flex flex-col md:flex-row gap-4">
                <div className="flex-1 max-w-xs">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Pilih Kelas</label>
                  <select
                    className="w-full border border-gray-300 rounded px-3 py-2"
                    value={selectedRombelForModal}
                    onChange={(e) => {
                      setSelectedRombelForModal(e.target.value ? Number(e.target.value) : '');
                      setSelectedStudentForModal('');
                    }}
                  >
                    <option value="">-- Pilih Kelas --</option>
                    {uniqueRombels.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.nama_kelas}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex-1 max-w-md">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Pilih Siswa</label>
                  <select
                    className="w-full border border-gray-300 rounded px-3 py-2"
                    value={selectedStudentForModal}
                    onChange={(e) => setSelectedStudentForModal(e.target.value ? Number(e.target.value) : '')}
                    disabled={!selectedRombelForModal}
                  >
                    <option value="">-- Pilih Siswa --</option>
                    {rekapData?.map((anggota: any) => (
                      <option key={anggota.id} value={anggota.id}>
                        {anggota.siswa?.nis} - {anggota.siswa?.nama_lengkap}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {selectedStudentForModal !== '' && rekapData && (() => {
                const studentData = rekapData.find((r: any) => r.id === selectedStudentForModal);
                
                if (!studentData) return null;

                // Process Mapel Nilai
                const mapelMap = new Map<number, any>();
                studentData.nilai?.forEach((n: any) => {
                  const mapelId = n.pengampu_mapel?.mapel_id;
                  if (!mapelId) return;

                  if (!mapelMap.has(mapelId)) {
                    mapelMap.set(mapelId, {
                      nama_mapel: n.pengampu_mapel.mapel.nama_mapel,
                      tugasList: [],
                      nilai_uts: 0,
                      nilai_uas: 0,
                    });
                  }

                  const mapelObj = mapelMap.get(mapelId);
                  if (n.jenis_nilai === 'TUGAS') mapelObj.tugasList.push(n.skor);
                  if (n.jenis_nilai === 'UTS') mapelObj.nilai_uts = n.skor;
                  if (n.jenis_nilai === 'UAS') mapelObj.nilai_uas = n.skor;
                });

                const mapelList = Array.from(mapelMap.values()).map((m: any) => {
                  const avgTugas = m.tugasList.length > 0
                    ? Math.round(m.tugasList.reduce((a: number, b: number) => a + b, 0) / m.tugasList.length)
                    : 0;
                  const akhir = Math.round((avgTugas * 0.2) + (m.nilai_uts * 0.3) + (m.nilai_uas * 0.5));
                  return {
                    ...m,
                    nilai_tugas: avgTugas,
                    akhir
                  };
                });

                return (
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-3">{studentData.siswa?.nama_lengkap}</h3>
                    <table className="w-full text-left border-collapse border border-gray-200">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="border border-gray-200 px-4 py-2 text-sm font-semibold">Mata Pelajaran</th>
                          <th className="border border-gray-200 px-4 py-2 text-sm font-semibold text-center">Avg. Tugas</th>
                          <th className="border border-gray-200 px-4 py-2 text-sm font-semibold text-center">UTS</th>
                          <th className="border border-gray-200 px-4 py-2 text-sm font-semibold text-center">UAS</th>
                          <th className="border border-gray-200 px-4 py-2 text-sm font-semibold text-center bg-indigo-50">Nilai Akhir</th>
                        </tr>
                      </thead>
                      <tbody>
                        {mapelList.map((m: any, idx: number) => (
                          <tr key={idx} className="hover:bg-gray-50">
                            <td className="border border-gray-200 px-4 py-2 text-sm">{m.nama_mapel}</td>
                            <td className="border border-gray-200 px-4 py-2 text-sm text-center">{m.nilai_tugas}</td>
                            <td className="border border-gray-200 px-4 py-2 text-sm text-center">{m.nilai_uts}</td>
                            <td className="border border-gray-200 px-4 py-2 text-sm text-center">{m.nilai_uas}</td>
                            <td className="border border-gray-200 px-4 py-2 text-sm text-center font-bold bg-indigo-50">{m.akhir}</td>
                          </tr>
                        ))}
                        {mapelList.length === 0 && (
                          <tr>
                            <td colSpan={5} className="text-center p-4 text-gray-500">Belum ada nilai yang dimasukkan</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                );
              })()}

              <div className="mt-6 text-sm text-gray-500 bg-gray-50 p-3 rounded border border-gray-200">
                <strong>Rumus Nilai Akhir:</strong> (Rata-rata Tugas × 20%) + (UTS × 30%) + (UAS × 50%)
              </div>
            </div>
            <div className="p-4 border-t border-gray-200 bg-gray-50 flex justify-end items-center gap-3">
              {selectedStudentForModal !== '' && (
                <button
                  onClick={() => {
                    setTimeout(() => {
                      window.print();
                    }, 100);
                  }}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded font-medium inline-flex items-center gap-2"
                >
                  <Printer className="w-4 h-4" /> Cetak Nilai
                </button>
              )}
              <button 
                onClick={() => {
                  setShowModalAkhir(false);
                  setSelectedStudentForModal('');
                }}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded font-medium"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
      
      <div className="print-show hidden">
        {/* If printing from outside modal */}
        {!showModalAkhir && selectedStudentForPrint && (
          <CetakMapelDocument
            student={selectedStudentForPrint}
            pengampu={selectedPengampu}
            nilaiData={nilaiData}
            maxTugas={maxTugas}
          />
        )}
        
        {/* If printing from inside modal */}
        {showModalAkhir && selectedStudentForModal !== '' && rekapData && (
          <CetakRekapAkhirDocument
            studentData={rekapData.find((r: any) => r.id === selectedStudentForModal)}
            rombelName={uniqueRombels.find(r => r.id === selectedRombelForModal)?.nama_kelas}
          />
        )}
      </div>
    </div>
  );
}
