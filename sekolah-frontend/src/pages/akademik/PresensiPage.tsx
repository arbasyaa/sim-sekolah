import React, { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useJadwalGuru, useRombelById, usePresensiJadwal, useInputPresensi } from '@/hooks/useAkademikData';
import { format } from 'date-fns';
import type { StatusPresensi, Presensi } from '@/types';

export default function PresensiPage() {
  const user = useAuthStore((state) => state.user);
  
  const [selectedJadwalId, setSelectedJadwalId] = useState<number | ''>('');
  const [tanggal, setTanggal] = useState<string>(format(new Date(), 'yyyy-MM-dd'));

  const { data: jadwalList, isLoading: isLoadingJadwal } = useJadwalGuru(user?.guru_id);
  
  const selectedJadwal = jadwalList?.find((j: any) => j.id === selectedJadwalId);
  const { data: rombel, isLoading: isLoadingRombel } = useRombelById(selectedJadwal?.pengampu_mapel?.rombel_id || null);
  
  const [activeTab, setActiveTab] = useState<'input' | 'rekap'>('input');

  const { data: presensiData, isLoading: isLoadingPresensi } = usePresensiJadwal(
    selectedJadwalId === '' ? null : selectedJadwalId,
    activeTab === 'input' ? tanggal : undefined
  );

  const { mutate: inputPresensi, isPending } = useInputPresensi();

  // Local state for presensi form
  const [presensiForm, setPresensiForm] = useState<Record<number, StatusPresensi>>({});

  // Sync with fetched data
  useEffect(() => {
    if (rombel?.anggota_kelas) {
      const newForm: Record<number, StatusPresensi> = {};
      rombel.anggota_kelas.forEach((a: any) => {
        const existing = presensiData?.find((p: Presensi) => p.anggota_rombel_id === a.id);
        newForm[a.id] = existing ? (existing.status as StatusPresensi) : 'HADIR';
      });
      setPresensiForm(newForm);
    }
  }, [rombel, presensiData]);

  const handleStatusChange = (anggotaId: number, status: StatusPresensi) => {
    setPresensiForm((prev) => ({
      ...prev,
      [anggotaId]: status,
    }));
  };

  const handleSave = () => {
    if (selectedJadwalId === '') return;
    
    const payload = {
      jadwal_id: selectedJadwalId,
      tanggal,
      items: Object.entries(presensiForm).map(([id, status]) => ({
        anggota_rombel_id: Number(id),
        status,
      })),
    };

    inputPresensi(payload, {
      onSuccess: () => {
        alert('Presensi berhasil disimpan');
      },
      onError: (err: any) => {
        alert(err.response?.data?.message || 'Gagal menyimpan presensi');
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

  // Calculate unique dates for rekap
  const uniqueDates = Array.from(new Set(presensiData?.map((p: Presensi) => p.tanggal?.toString().split('T')[0]))).sort();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Presensi Mengajar (Per Jadwal)</h1>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100">
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('input')}
            className={`px-6 py-3 text-sm font-medium ${
              activeTab === 'input'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Input Presensi
          </button>
          <button
            onClick={() => setActiveTab('rekap')}
            className={`px-6 py-3 text-sm font-medium ${
              activeTab === 'rekap'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Rekap Presensi
          </button>
        </div>

        <div className="p-6 flex flex-col md:flex-row gap-4 items-end bg-gray-50">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Pilih Jadwal Mengajar</label>
            <select
              className="w-full border border-gray-300 rounded px-3 py-2"
              value={selectedJadwalId}
              onChange={(e) => setSelectedJadwalId(e.target.value ? Number(e.target.value) : '')}
            >
              <option value="">-- Pilih Jadwal --</option>
              {jadwalList?.map((j: any) => (
                <option key={j.id} value={j.id}>
                  {j.pengampu_mapel?.rombel?.nama_kelas} - {j.pengampu_mapel?.mapel?.nama_mapel} ({j.hari}, {j.jam_mulai}-{j.jam_selesai})
                </option>
              ))}
            </select>
          </div>
          {activeTab === 'input' && (
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Kehadiran</label>
              <input
                type="date"
                className="w-full border border-gray-300 rounded px-3 py-2"
                value={tanggal}
                onChange={(e) => setTanggal(e.target.value)}
              />
            </div>
          )}
        </div>
      </div>

      {selectedJadwalId !== '' && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
          {(isLoadingJadwal || isLoadingRombel || isLoadingPresensi) ? (
            <div className="p-8 text-center text-gray-500">Memuat data...</div>
          ) : rombel?.anggota_kelas?.length === 0 ? (
            <div className="p-8 text-center text-gray-500">Belum ada siswa di kelas ini.</div>
          ) : activeTab === 'input' ? (
            <>
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="px-6 py-3 text-sm font-semibold text-gray-600 w-16">No</th>
                    <th className="px-6 py-3 text-sm font-semibold text-gray-600">NIS / NISN</th>
                    <th className="px-6 py-3 text-sm font-semibold text-gray-600">Nama Siswa</th>
                    <th className="px-6 py-3 text-sm font-semibold text-gray-600 w-48">Status Kehadiran</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {rombel?.anggota_kelas?.map((anggota: any, index: number) => (
                    <tr key={anggota.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-600">{index + 1}</td>
                      <td className="px-6 py-4 text-sm text-gray-800">
                        {anggota.siswa?.nis} / {anggota.siswa?.nisn}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-800">
                        {anggota.siswa?.nama_lengkap}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        <select
                          className="border border-gray-300 rounded px-2 py-1 bg-white"
                          value={presensiForm[anggota.id] || 'HADIR'}
                          onChange={(e) => handleStatusChange(anggota.id, e.target.value as StatusPresensi)}
                        >
                          <option value="HADIR">Hadir</option>
                          <option value="SAKIT">Sakit</option>
                          <option value="IZIN">Izin</option>
                          <option value="ALPA">Alpa</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="p-6 border-t border-gray-200 flex justify-end">
                <button
                  onClick={handleSave}
                  disabled={isPending}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded font-medium disabled:opacity-50"
                >
                  {isPending ? 'Menyimpan...' : 'Simpan Presensi'}
                </button>
              </div>
            </>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="px-6 py-3 text-sm font-semibold text-gray-600 w-16">No</th>
                    <th className="px-6 py-3 text-sm font-semibold text-gray-600">Siswa</th>
                    {uniqueDates.map(date => (
                      <th key={date as string} className="px-3 py-3 text-sm font-semibold text-gray-600 whitespace-nowrap">
                        {date && format(new Date(date as string), 'dd/MM')}
                      </th>
                    ))}
                    <th className="px-6 py-3 text-sm font-semibold text-gray-600">Total Hadir</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {rombel?.anggota_kelas?.map((anggota: any, index: number) => {
                    let totalHadir = 0;
                    return (
                      <tr key={anggota.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm text-gray-600">{index + 1}</td>
                        <td className="px-6 py-4 text-sm font-medium text-gray-800">
                          {anggota.siswa?.nama_lengkap}
                          <div className="text-xs text-gray-500 font-normal">{anggota.siswa?.nis}</div>
                        </td>
                        {uniqueDates.map(date => {
                          const p = presensiData?.find((x: Presensi) => x.anggota_rombel_id === anggota.id && x.tanggal?.toString().startsWith(date as string));
                          if (p?.status === 'HADIR') totalHadir++;
                          return (
                            <td key={date as string} className="px-3 py-4 text-sm">
                              {p?.status === 'HADIR' && <span className="text-green-600 font-bold">H</span>}
                              {p?.status === 'SAKIT' && <span className="text-yellow-600 font-bold">S</span>}
                              {p?.status === 'IZIN' && <span className="text-blue-600 font-bold">I</span>}
                              {p?.status === 'ALPA' && <span className="text-red-600 font-bold">A</span>}
                              {!p && <span className="text-gray-300">-</span>}
                            </td>
                          );
                        })}
                        <td className="px-6 py-4 text-sm font-bold text-gray-800">{totalHadir}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}