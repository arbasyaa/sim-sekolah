import { useState, useRef } from 'react';
import { useGuru, useCreateGuru, useUpdateGuru, useDeleteGuru, useImportGuru } from '@/hooks/useMasterData';
import type { Guru } from '@/types';
import { Plus, Pencil, Trash2, X, Upload } from 'lucide-react';

interface FormData {
    nip: string;
    nama_lengkap: string;
    no_hp: string;
}

const emptyForm: FormData = { nip: '', nama_lengkap: '', no_hp: '' };

export default function GuruPage() {
    const { data: guruList, isLoading } = useGuru();
  const createGuru = useCreateGuru();
  const updateGuru = useUpdateGuru();
  const deleteGuru = useDeleteGuru();
  const importGuru = useImportGuru();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [showModal, setShowModal] = useState(false);
    const [editId, setEditId] = useState<number | null>(null);
    const [form, setForm] = useState<FormData>(emptyForm);

    const openCreate = () => {
        setEditId(null);
        setForm(emptyForm);
        setShowModal(true);
    };

    const openEdit = (guru: Guru) => {
        setEditId(guru.id);
        setForm({ nip: guru.nip, nama_lengkap: guru.nama_lengkap, no_hp: guru.no_hp || '' });
        setShowModal(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const payload = { ...form, no_hp: form.no_hp || null };
        if (editId) {
            updateGuru.mutate({ id: editId, ...payload }, { onSuccess: () => setShowModal(false) });
        } else {
            createGuru.mutate(payload, { onSuccess: () => setShowModal(false) });
        }
    };

  const handleDelete = (id: number) => {
    if (confirm('Yakin ingin menghapus data guru ini?')) {
      deleteGuru.mutate(id);
    }
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const res = await importGuru.mutateAsync(file);
      alert(`Import Selesai!\nSukses: ${res.data.success}\nGagal: ${res.data.failed}`);
      if (res.data.errors?.length > 0) {
        console.log("Errors:", res.data.errors);
        alert('Beberapa baris gagal diimport. Cek console untuk detailnya.');
      }
    } catch (error: any) {
      alert(error.response?.data?.message || 'Gagal import Excel');
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

    return (
        <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-800">Data Guru</h2>
        <div className="flex gap-2">
          <input 
            type="file" 
            accept=".xlsx, .xls" 
            className="hidden" 
            ref={fileInputRef} 
            onChange={handleImport}
          />
          <button 
            onClick={() => fileInputRef.current?.click()} 
            disabled={importGuru.isPending}
            className="flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            <Upload className="h-4 w-4" /> {importGuru.isPending ? 'Mengimpor...' : 'Import Excel'}
          </button>
          <button onClick={openCreate} className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white hover:bg-primary-dark">
            <Plus className="h-4 w-4" /> Tambah Guru
          </button>
        </div>
      </div>

            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                <table className="w-full text-left text-sm">
                    <thead className="border-b border-slate-200 bg-slate-50">
                        <tr>
                            <th className="px-6 py-3 font-semibold text-slate-600">No</th>
                            <th className="px-6 py-3 font-semibold text-slate-600">NIP</th>
                            <th className="px-6 py-3 font-semibold text-slate-600">Nama Lengkap</th>
                            <th className="px-6 py-3 font-semibold text-slate-600">No HP</th>
                            <th className="px-6 py-3 font-semibold text-slate-600">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? (
                            <tr><td colSpan={5} className="px-6 py-8 text-center text-slate-400">Memuat data...</td></tr>
                        ) : !guruList?.length ? (
                            <tr><td colSpan={5} className="px-6 py-8 text-center text-slate-400">Belum ada data guru</td></tr>
                        ) : (
                            guruList.map((g, i) => (
                                <tr key={g.id} className="border-b border-slate-100 hover:bg-slate-50">
                                    <td className="px-6 py-3">{i + 1}</td>
                                    <td className="px-6 py-3 font-mono">{g.nip}</td>
                                    <td className="px-6 py-3 font-medium">{g.nama_lengkap}</td>
                                    <td className="px-6 py-3">{g.no_hp || '—'}</td>
                                    <td className="flex gap-2 px-6 py-3">
                                        <button onClick={() => openEdit(g)} className="rounded p-1.5 text-blue-600 hover:bg-blue-50"><Pencil className="h-4 w-4" /></button>
                                        <button onClick={() => handleDelete(g.id)} className="rounded p-1.5 text-red-600 hover:bg-red-50"><Trash2 className="h-4 w-4" /></button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
                        <div className="mb-4 flex items-center justify-between">
                            <h3 className="text-lg font-bold text-slate-800">{editId ? 'Edit Guru' : 'Tambah Guru'}</h3>
                            <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600"><X className="h-5 w-5" /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="mb-1 block text-sm font-medium text-slate-700">NIP</label>
                                <input value={form.nip} onChange={(e) => setForm({ ...form, nip: e.target.value })} required className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20" />
                            </div>
                            <div>
                                <label className="mb-1 block text-sm font-medium text-slate-700">Nama Lengkap</label>
                                <input value={form.nama_lengkap} onChange={(e) => setForm({ ...form, nama_lengkap: e.target.value })} required className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20" />
                            </div>
                            <div>
                                <label className="mb-1 block text-sm font-medium text-slate-700">No HP</label>
                                <input value={form.no_hp} onChange={(e) => setForm({ ...form, no_hp: e.target.value })} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20" />
                            </div>
                            <div className="flex justify-end gap-3 pt-2">
                                <button type="button" onClick={() => setShowModal(false)} className="rounded-lg border border-slate-300 px-4 py-2 text-sm hover:bg-slate-50">Batal</button>
                                <button type="submit" disabled={createGuru.isPending || updateGuru.isPending} className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark disabled:opacity-50">
                                    {createGuru.isPending || updateGuru.isPending ? 'Menyimpan...' : 'Simpan'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}