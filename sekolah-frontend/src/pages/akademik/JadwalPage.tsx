import React, { useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import {
    useRombel,
    useRombelById,
    useJadwalRombel,
    useCreateJadwal,
    useDeleteJadwal,
} from '@/hooks/useAkademikData';
import { Trash2 } from 'lucide-react';

const HARI_OPTIONS = ['SENIN', 'SELASA', 'RABU', 'KAMIS', 'JUMAT', 'SABTU'];

export default function JadwalPage() {
    const user = useAuthStore((state) => state.user);
    const isAdmin = user?.role === 'SUPERADMIN' || user?.role === 'ADMIN_TU';

    const { data: rombelList, isLoading: isLoadingRombel } = useRombel();
    const [selectedRombel, setSelectedRombel] = useState<number | ''>('');

    const { data: rombelDetail } = useRombelById(selectedRombel ? Number(selectedRombel) : null);
    const { data: jadwalList, isLoading: isLoadingJadwal } = useJadwalRombel(
        selectedRombel ? Number(selectedRombel) : null
    );

    const { mutate: createJadwal, isPending: isCreating } = useCreateJadwal();
    const { mutate: deleteJadwal, isPending: isDeleting } = useDeleteJadwal();

    // Form State
    const [pengampuMapelId, setPengampuMapelId] = useState<number | ''>('');
    const [hari, setHari] = useState('SENIN');
    const [jamMulai, setJamMulai] = useState('07:00');
    const [jamSelesai, setJamSelesai] = useState('08:30');

    const mapelDiajarkan = rombelDetail?.mapel_diajarkan || [];

    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedRombel || !pengampuMapelId || !hari || !jamMulai || !jamSelesai) return;

        createJadwal(
            {
                pengampu_mapel_id: Number(pengampuMapelId),
                hari,
                jam_mulai: jamMulai,
                jam_selesai: jamSelesai,
            },
            {
                onSuccess: () => {
                    setPengampuMapelId('');
                    setHari('SENIN');
                    setJamMulai('07:00');
                    setJamSelesai('08:30');
                    alert('Jadwal berhasil ditambahkan!');
                },
                onError: (error: any) => {
                    alert(error.response?.data?.message || 'Gagal menambahkan jadwal');
                },
            }
        );
    };

    const handleDelete = (id: number) => {
        if (window.confirm('Yakin ingin menghapus jadwal ini?')) {
            deleteJadwal(id, {
                onSuccess: () => {
                    alert('Jadwal berhasil dihapus!');
                },
                onError: (error: any) => {
                    alert(error.response?.data?.message || 'Gagal menghapus jadwal');
                },
            });
        }
    };

    if (isLoadingRombel) return <div>Loading...</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900">Manajemen Jadwal Pelajaran</h1>
            </div>

            {/* Filter */}
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <div className="max-w-xs">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Pilih Rombongan Belajar
                    </label>
                    <select
                        className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        value={selectedRombel}
                        onChange={(e) => {
                            setSelectedRombel(e.target.value === '' ? '' : Number(e.target.value));
                            setPengampuMapelId('');
                        }}
                    >
                        <option value="">-- Pilih Rombel --</option>
                        {rombelList?.map((r: any) => (
                            <option key={r.id} value={r.id}>
                                {r.nama_kelas}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {selectedRombel && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Form Tambah Jadwal */}
                    {isAdmin && (
                        <div className="md:col-span-1 bg-white p-4 rounded-lg shadow-sm border border-gray-200 h-fit">
                            <h2 className="text-lg font-medium text-gray-900 mb-4">Tambah Jadwal Baru</h2>
                            <form onSubmit={handleCreate} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Mata Pelajaran (Guru)
                                    </label>
                                    <select
                                        required
                                        className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                        value={pengampuMapelId}
                                        onChange={(e) => setPengampuMapelId(e.target.value ? Number(e.target.value) : '')}
                                    >
                                        <option value="">-- Pilih Mapel --</option>
                                        {mapelDiajarkan.map((pm: any) => (
                                            <option key={pm.id} value={pm.id}>
                                                {pm.mapel?.nama_mapel} ({pm.guru?.nama_lengkap})
                                            </option>
                                        ))}
                                    </select>
                                    {mapelDiajarkan.length === 0 && (
                                        <p className="text-xs text-red-500 mt-1">
                                            Rombel ini belum memiliki pengampu mata pelajaran. Silakan tambahkan pengampu terlebih dahulu.
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Hari</label>
                                    <select
                                        required
                                        className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                        value={hari}
                                        onChange={(e) => setHari(e.target.value)}
                                    >
                                        {HARI_OPTIONS.map((h) => (
                                            <option key={h} value={h}>
                                                {h}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Jam Mulai
                                        </label>
                                        <input
                                            type="time"
                                            required
                                            className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                            value={jamMulai}
                                            onChange={(e) => setJamMulai(e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Jam Selesai
                                        </label>
                                        <input
                                            type="time"
                                            required
                                            className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                            value={jamSelesai}
                                            onChange={(e) => setJamSelesai(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isCreating || !pengampuMapelId}
                                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
                                >
                                    {isCreating ? 'Menyimpan...' : 'Simpan Jadwal'}
                                </button>
                            </form>
                        </div>
                    )}

                    {/* List Jadwal */}
                    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden ${isAdmin ? 'md:col-span-2' : 'md:col-span-3'}`}>
                        <div className="p-4 border-b border-gray-200">
                            <h2 className="text-lg font-medium text-gray-900">
                                Jadwal Kelas: {rombelList?.find((r: any) => r.id === selectedRombel)?.nama_kelas}
                            </h2>
                        </div>
                        {isLoadingJadwal ? (
                            <div className="p-4 text-center text-gray-500">Loading jadwal...</div>
                        ) : jadwalList && jadwalList.length > 0 ? (
                            <div className="overflow-x-auto">
                                {(() => {
                                    const timeSlots = Array.from(
                                        new Set(jadwalList.map((j: any) => `${j.jam_mulai} - ${j.jam_selesai}`))
                                    ).sort();
                                    
                                    const hariList = ['SENIN', 'SELASA', 'RABU', 'KAMIS', 'JUMAT'];

                                    return (
                                        <table className="min-w-full divide-y divide-gray-200 border">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th className="px-4 py-3 border text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-100">
                                                        Jam \ Hari
                                                    </th>
                                                    {hariList.map(h => (
                                                        <th key={h} className="px-4 py-3 border text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                            {h}
                                                        </th>
                                                    ))}
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {timeSlots.map(time => (
                                                    <tr key={time}>
                                                        <td className="px-4 py-3 border whitespace-nowrap text-sm font-medium text-gray-900 bg-gray-50">
                                                            {time}
                                                        </td>
                                                        {hariList.map(hari => {
                                                            const item = jadwalList.find((j: any) => j.hari === hari && `${j.jam_mulai} - ${j.jam_selesai}` === time);
                                                            return (
                                                                <td key={`${time}-${hari}`} className="px-4 py-3 border text-sm text-center align-top relative min-w-[150px]">
                                                                    {item ? (
                                                                        <div className="flex flex-col h-full justify-between gap-2 p-1 rounded bg-blue-50 border border-blue-100">
                                                                            <div>
                                                                                <div className="font-semibold text-blue-900 text-xs">
                                                                                    {item.pengampu_mapel?.mapel?.nama_mapel}
                                                                                </div>
                                                                                <div className="text-gray-500 text-[11px] mt-1">
                                                                                    {item.pengampu_mapel?.guru?.nama_lengkap}
                                                                                </div>
                                                                            </div>
                                                                            {isAdmin && (
                                                                                <button
                                                                                    onClick={() => handleDelete(item.id)}
                                                                                    disabled={isDeleting}
                                                                                    className="text-red-500 hover:text-red-700 disabled:opacity-50 self-end mt-1"
                                                                                    title="Hapus Jadwal"
                                                                                >
                                                                                    <Trash2 size={14} />
                                                                                </button>
                                                                            )}
                                                                        </div>
                                                                    ) : (
                                                                        <span className="text-gray-300">-</span>
                                                                    )}
                                                                </td>
                                                            );
                                                        })}
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    );
                                })()}
                            </div>
                        ) : (
                            <div className="p-8 text-center text-gray-500">
                                Belum ada jadwal untuk rombel ini.
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}