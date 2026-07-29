import { useState } from 'react';
import { useMapel, useCreateMapel, useUpdateMapel, useDeleteMapel } from '@/hooks/useMasterData';
import type { Mapel } from '@/types';
import { Plus, Pencil, Trash2, X } from 'lucide-react';

interface FormData { kode_mapel: string; nama_mapel: string; }
const emptyForm: FormData = { kode_mapel: '', nama_mapel: '' };

export default function MapelPage() {
  const { data: mapelList, isLoading } = useMapel();
  const createMapel = useCreateMapel();
  const updateMapel = useUpdateMapel();
  const deleteMapel = useDeleteMapel();

  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState<FormData>(emptyForm);

  const openCreate = () => { setEditId(null); setForm(emptyForm); setShowModal(true); };
  const openEdit = (m: Mapel) => { setEditId(m.id); setForm({ kode_mapel: m.kode_mapel, nama_mapel: m.nama_mapel }); setShowModal(true); };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editId) {
      updateMapel.mutate({ id: editId, ...form }, { onSuccess: () => setShowModal(false) });
    } else {
      createMapel.mutate(form, { onSuccess: () => setShowModal(false) });
    }
  };

  const handleDelete = (id: number) => { if (confirm('Yakin ingin menghapus mata pelajaran ini?')) deleteMapel.mutate(id); };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-800">Mata Pelajaran</h2>
        <button onClick={openCreate} className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white hover:bg-primary-dark">
          <Plus className="h-4 w-4" /> Tambah Mapel
        </button>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50">
            <tr>
              <th className="px-6 py-3 font-semibold text-slate-600">No</th>
              <th className="px-6 py-3 font-semibold text-slate-600">Kode</th>
              <th className="px-6 py-3 font-semibold text-slate-600">Nama Mata Pelajaran</th>
              <th className="px-6 py-3 font-semibold text-slate-600">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan={4} className="px-6 py-8 text-center text-slate-400">Memuat data...</td></tr>
            ) : !mapelList?.length ? (
              <tr><td colSpan={4} className="px-6 py-8 text-center text-slate-400">Belum ada data</td></tr>
            ) : (
              mapelList.map((m, i) => (
                <tr key={m.id} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="px-6 py-3">{i + 1}</td>
                  <td className="px-6 py-3 font-mono">{m.kode_mapel}</td>
                  <td className="px-6 py-3 font-medium">{m.nama_mapel}</td>
                  <td className="flex gap-2 px-6 py-3">
                    <button onClick={() => openEdit(m)} className="rounded p-1.5 text-blue-600 hover:bg-blue-50"><Pencil className="h-4 w-4" /></button>
                    <button onClick={() => handleDelete(m.id)} className="rounded p-1.5 text-red-600 hover:bg-red-50"><Trash2 className="h-4 w-4" /></button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-800">{editId ? 'Edit Mapel' : 'Tambah Mapel'}</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600"><X className="h-5 w-5" /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Kode Mapel</label>
                <input value={form.kode_mapel} onChange={(e) => setForm({ ...form, kode_mapel: e.target.value })} required className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Nama Mata Pelajaran</label>
                <input value={form.nama_mapel} onChange={(e) => setForm({ ...form, nama_mapel: e.target.value })} required className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20" />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="rounded-lg border border-slate-300 px-4 py-2 text-sm hover:bg-slate-50">Batal</button>
                <button type="submit" disabled={createMapel.isPending || updateMapel.isPending} className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark disabled:opacity-50">
                  {createMapel.isPending || updateMapel.isPending ? 'Menyimpan...' : 'Simpan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}