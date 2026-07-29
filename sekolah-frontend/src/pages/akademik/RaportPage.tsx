import { useState } from 'react';
import { usePengampuGuru, useRekapRaport } from '@/hooks/useAkademikData';
import { Printer } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';

// Sub-component for printing
const RaportDocument = ({ studentData, rombelData }: { studentData: any, rombelData: any }) => {
    if (!studentData) return null;

  // Calculate Presensi
  const sakit = studentData.presensi?.filter((p: any) => p.status === 'SAKIT').length || 0;
    const izin = studentData.presensi?.filter((p: any) => p.status === 'IZIN').length || 0;
    const alpa = studentData.presensi?.filter((p: any) => p.status === 'ALPA').length || 0;

    // Group Nilai by Mapel
    const mapelMap = new Map<number, any>();
    studentData.nilai?.forEach((n: any) => {
        const mapelId = n.pengampu_mapel?.mapel_id;
        if (!mapelId) return;

        if (!mapelMap.has(mapelId)) {
            mapelMap.set(mapelId, {
                nama_mapel: n.pengampu_mapel.mapel.nama_mapel,
                kkm: 75,
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
        return {
            ...m,
            nilai_tugas: avgTugas
        };
    });

    return (
        <div className="print-only p-10 bg-white text-black font-sans w-[210mm] min-h-[297mm] mx-auto">
            {/* Header */}
            <div className="text-center mb-8 border-b-2 border-black pb-4">
                <h1 className="text-2xl font-bold uppercase">Laporan Hasil Belajar Siswa</h1>
                <h2 className="text-xl font-bold">SMA BINA NUSANTARA</h2>
                <p className="text-sm">Jl. Pendidikan No. 123, Jakarta Selatan</p>
            </div>

            {/* Student Info */}
            <div className="flex justify-between mb-8 text-sm">
                <table className="w-1/2">
                    <tbody>
                        <tr><td className="w-32 py-1">Nama Peserta Didik</td><td className="w-4">:</td><td className="font-bold">{studentData.siswa?.nama_lengkap}</td></tr>
                        <tr><td className="w-32 py-1">NIS / NISN</td><td>:</td><td>{studentData.siswa?.nis} / {studentData.siswa?.nisn}</td></tr>
                    </tbody>
                </table>
                <table className="w-1/2">
                    <tbody>
                        <tr><td className="w-32 py-1">Kelas</td><td className="w-4">:</td><td>{rombelData?.nama_kelas}</td></tr>
                        <tr><td className="w-32 py-1">Tahun Ajaran</td><td>:</td><td>{rombelData?.tahun_ajaran?.tahun}</td></tr>
                    </tbody>
                </table>
            </div>

            {/* Nilai Table */}
            <div className="mb-8">
                <h3 className="font-bold mb-2">A. NILAI AKADEMIK</h3>
                <table className="w-full border-collapse border border-black text-sm">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="border border-black px-2 py-2 w-12">No</th>
                            <th className="border border-black px-2 py-2 text-left">Mata Pelajaran</th>
                            <th className="border border-black px-2 py-2 w-16">KKM</th>
                            <th className="border border-black px-2 py-2 w-16">Tugas</th>
                            <th className="border border-black px-2 py-2 w-16">UTS</th>
                            <th className="border border-black px-2 py-2 w-16">UAS</th>
                            <th className="border border-black px-2 py-2 w-20">Akhir</th>
                            <th className="border border-black px-2 py-2 w-20">Predikat</th>
                        </tr>
                    </thead>
                    <tbody>
                        {mapelList.length === 0 ? (
                            <tr>
                                <td colSpan={8} className="border border-black px-2 py-4 text-center">Belum ada nilai</td>
                            </tr>
                        ) : (
                            mapelList.map((m, idx) => {
                                const akhir = Math.round((m.nilai_tugas * 0.2) + (m.nilai_uts * 0.3) + (m.nilai_uas * 0.5));
                                let predikat = 'D';
                                if (akhir >= 90) predikat = 'A';
                                else if (akhir >= 80) predikat = 'B';
                                else if (akhir >= 70) predikat = 'C';

                                return (
                                    <tr key={idx}>
                                        <td className="border border-black px-2 py-2 text-center">{idx + 1}</td>
                                        <td className="border border-black px-2 py-2">{m.nama_mapel}</td>
                                        <td className="border border-black px-2 py-2 text-center">{m.kkm}</td>
                                        <td className="border border-black px-2 py-2 text-center">{m.nilai_tugas}</td>
                                        <td className="border border-black px-2 py-2 text-center">{m.nilai_uts}</td>
                                        <td className="border border-black px-2 py-2 text-center">{m.nilai_uas}</td>
                                        <td className="border border-black px-2 py-2 text-center font-bold">{akhir}</td>
                                        <td className="border border-black px-2 py-2 text-center">{predikat}</td>
                                    </tr>
                                )
                            })
                        )}
                    </tbody>
                </table>
            </div>

            {/* Presensi Table */}
            <div className="mb-16">
                <h3 className="font-bold mb-2">B. KETIDAKHADIRAN</h3>
                <table className="w-1/2 border-collapse border border-black text-sm">
                    <tbody>
                        <tr>
                            <td className="border border-black px-4 py-2">Sakit</td>
                            <td className="border border-black px-4 py-2 text-center w-24">{sakit} hari</td>
                        </tr>
                        <tr>
                            <td className="border border-black px-4 py-2">Izin</td>
                            <td className="border border-black px-4 py-2 text-center">{izin} hari</td>
                        </tr>
                        <tr>
                            <td className="border border-black px-4 py-2">Tanpa Keterangan</td>
                            <td className="border border-black px-4 py-2 text-center">{alpa} hari</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            {/* Signatures */}
            <div className="flex justify-between text-sm">
                <div className="text-center w-48">
                    <p className="mb-16">Orang Tua/Wali,</p>
                    <p className="border-b border-black">...........................</p>
                </div>
                <div className="text-center w-48">
                    <p className="mb-16">Wali Kelas,</p>
                    <p className="border-b border-black">...........................</p>
                </div>
            </div>
        </div>
    );
};

export default function RaportPage() {
    const user = useAuthStore((state) => state.user);
    const [selectedRombelId, setSelectedRombelId] = useState<number | ''>('');
    const [selectedAnggota, setSelectedAnggota] = useState<any>(null);

    const { data: pengampuList } = usePengampuGuru(user?.guru_id);
    const { data: rekapData, isLoading: isLoadingRekap } = useRekapRaport(
        selectedRombelId === '' ? null : selectedRombelId
    );

    const rombelList = pengampuList
        ? Array.from(new Map(pengampuList.map((p: any) => [p.rombel_id, p.rombel])).values())
        : [];

    const handlePrint = () => {
        window.print();
    };

    const selectedRombelData = rombelList?.find((r: any) => r.id === selectedRombelId);

    return (
        <div className="space-y-6 print-hide">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-800">Cetak Raport</h1>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Pilih Kelas</label>
                    <select
                        className="w-full border border-gray-300 rounded px-3 py-2"
                        value={selectedRombelId}
                        onChange={(e) => {
                            setSelectedRombelId(e.target.value ? Number(e.target.value) : '');
                            setSelectedAnggota(null);
                        }}
                    >
                        <option value="">-- Semua Kelas --</option>
                        {rombelList?.map((r: any) => (
                            <option key={r.id} value={r.id}>
                                {r.nama_kelas} - {r.tahun_ajaran?.tahun}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {selectedRombelId !== '' && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                    {isLoadingRekap ? (
                        <div className="p-8 text-center text-gray-500">Memuat rekap nilai...</div>
                    ) : rekapData?.length === 0 ? (
                        <div className="p-8 text-center text-gray-500">Belum ada siswa di kelas ini.</div>
                    ) : (
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-200">
                                    <th className="px-6 py-3 text-sm font-semibold text-gray-600 w-16">No</th>
                                    <th className="px-6 py-3 text-sm font-semibold text-gray-600">NIS</th>
                                    <th className="px-6 py-3 text-sm font-semibold text-gray-600">Nama Siswa</th>
                                    <th className="px-6 py-3 text-sm font-semibold text-gray-600 text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {rekapData?.map((anggota: any, index: number) => (
                                    <tr key={anggota.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 text-sm text-gray-600">{index + 1}</td>
                                        <td className="px-6 py-4 text-sm text-gray-800">{anggota.siswa?.nis}</td>
                                        <td className="px-6 py-4 text-sm font-medium text-gray-800">{anggota.siswa?.nama_lengkap}</td>
                                        <td className="px-6 py-4 text-sm text-right">
                                            <button
                                                onClick={() => {
                                                    setSelectedAnggota(anggota);
                                                    setTimeout(() => {
                                                        handlePrint();
                                                    }, 100);
                                                }}
                                                className="inline-flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded text-sm font-medium transition-colors"
                                            >
                                                <Printer className="w-4 h-4" />
                                                Cetak Raport
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            )}

            {/* Printable Area is handled in global CSS or App layout but we will just output it normally and use CSS to hide rest */}
            <div className="print-show hidden">
                {selectedAnggota && (
                    <RaportDocument
                        studentData={selectedAnggota}
                        rombelData={selectedRombelData}
                    />
                )}
            </div>
        </div>
    );
}