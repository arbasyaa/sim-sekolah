import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { usePengampuGuru, useRombelById, usePresensiRombel, useInputPresensi } from '@/hooks/useAkademikData';
import { format } from 'date-fns';
import type { StatusPresensi } from '@/types';

export default function PresensiPage() {
  const user = useAuthStore((state) => state.user);
  
  const [selectedRombelId, setSelectedRombelId] = useState<number | ''>('');
  const [tanggal, setTanggal] = useState<string>(format(new Date(), 'yyyy-MM-dd'));

  const { data: pengampuList } = usePengampuGuru(user?.guru_id);
  const { data: rombel, isLoading: isLoadingRombel } = useRombelById(selectedRombelId === '' ? null : selectedRombelId);
  const { data: presensiData, isLoading: isLoadingPresensi } = usePresensiRombel(
    selectedRombelId === '' ? null : selectedRombelId,
    tanggal
  );

  const { mutate: inputPresensi, isPending } = useInputPresensi();

  // Extract unique rombel from pengampu
  const uniqueRombel = pengampuList
    ? Array.from(new Map(pengampuList.map((p) => [p.rombel_id, p.rombel])).values())
    : [];

  // Local state for presensi form
  const [presensiForm, setPresensiForm] = useState<Record<number, StatusPresensi>>({});

  // Sync with fetched data
  useEffect(() => {
    if (rombel?.anggota_kelas) {
      const newForm: Record<number, StatusPresensi> = {};
      rombel.anggota_kelas.forEach((a) => {
        const existing = presensiData?.find((p) => p.anggota_rombel_id === a.id);
        newForm[a.id] = existing ? existing.status : 'HADIR'; // Default HADIR
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
    if (selectedRombelId === '') return;
    
    const payload = {
      rombel_id: selectedRombelId,
      tanggal,
      presensi: Object.entries(presensiForm).map(([id, status]) => ({
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Input Presensi Harian</h1>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 items-end">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">Kelas (Rombel)</label>
          <select
            className="w-full border border-gray-300 rounded px-3 py-2"
            value={selectedRombelId}
            onChange={(e) => setSelectedRombelId(e.target.value ? Number(e.target.value) : '')}
          >
            <option value="">-- Pilih Kelas --</option>
            {uniqueRombel.map((r) => (
              <option key={r?.id} value={r?.id}>
                {r?.nama_kelas}
              </option>
            ))}
          </select>
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal</label>
          <input
            type="date"
            className="w-full border border-gray-300 rounded px-3 py-2"
            value={tanggal}
            onChange={(e) => setTanggal(e.target.value)}
          />
        </div>
      </div>

      {selectedRombelId !== '' && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
          {(isLoadingRombel || isLoadingPresensi) ? (
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
                    <th className="px-6 py-3 text-sm font-semibold text-gray-600 w-48">Status Kehadiran</th>
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
          )}
        </div>
      )}
    </div>
  );
}