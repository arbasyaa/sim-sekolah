import { useState } from 'react';
import { useSiswa, useCreateSiswa, useUpdateSiswa, useDeleteSiswa } from '@/hooks/useMasterData';
import type { Siswa, JenisKelamin } from '@/types';
import { Plus, Pencil, Trash2, X } from 'lucide-react';

interface FormData {
  nis: string;
  nisn: string;
  nama_lengkap: string;
  jenis_kelamin: JenisKelamin;
}

const emptyForm: FormData = { nis: '', nisn: '', nama_lengkap: '', jenis_kelamin: 'LAKI_LAKI' };

export default function SiswaPage() {
  const { data: siswaList, isLoading } = useSiswa();
  const createSiswa = useCreateSiswa();
  const updateSiswa = useUpdateSiswa();
  const deleteSiswa = useDeleteSiswa();

  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState<FormData>(emptyForm);

  const openCreate = () => { setEditId(null); setForm(emptyForm); setShowModal(true); };
  const openEdit = (s: Siswa) => { setEditId(s.id); setForm({ nis: s.nis, nisn: s.nisn, nama_lengkap: s.nama_lengkap, jenis_kelamin: s.jenis_kelamin }); setShowModal(true); };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editId) {
      updateSiswa.mutate({ id: editId, ...form }, { onSuccess: () => setShowModal(false) });
    } else {
      createSiswa.mutate(form, { onSuccess: () => setShowModal(false) });
    }
  };

  const handleDelete = (id: number) => { if (confirm('Yakin ingin menghapus data siswa ini?')) deleteSiswa.mutate(id); };

  const jkLabel = (jk: JenisKelamin) => jk === 'LAKI_LAKI' ? 'Laki-laki' : 'Perempuan';

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-800">Data Siswa</h2>
        <button onClick={openCreate} className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white hover:bg-primary-dark">
          <Plus className="h-4 w-4" /> Tambah Siswa
        </button>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50">
            <tr>
              <th className="px-6 py-3 font-semibold text-slate-600">No</th>
              <th className="px-6 py-3 font-semibold text-slate-600">NIS</th>
              <th className="px-6 py-3 font-semibold text-slate-600">NISN</th>
              <th className="px-6 py-3 font-semibold text-slate-600">Nama Lengkap</th>
              <th className="px-6 py-3 font-semibold text-slate-600">Jenis Kelamin</th>
              <th className="px-6 py-3 font-semibold text-slate-600">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan={6} className="px-6 py-8 text-center text-slate-400">Memuat data...</td></tr>
            ) : !siswaList?.length ? (
              <tr><td colSpan={6} className="px-6 py-8 text-center text-slate-400">Belum ada data siswa</td></tr>
            ) : (
              siswaList.map((s, i) => (
                <tr key={s.id} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="px-6 py-3">{i + 1}</td>
                  <td className="px-6 py-3 font-mono">{s.nis}</td>
                  <td className="px-6 py-3 font-mono">{s.nisn}</td>
                  <td className="px-6 py-3 font-medium">{s.nama_lengkap}</td>
                  <td className="px-6 py-3">{jkLabel(s.jenis_kelamin)}</td>
                  <td className="flex gap-2 px-6 py-3">
                    <button onClick={() => openEdit(s)} className="rounded p-1.5 text-blue-600 hover:bg-blue-50"><Pencil className="h-4 w-4" /></button>
                    <button onClick={() => handleDelete(s.id)} className="rounded p-1.5 text-red-600 hover:bg-red-50"><Trash2 className="h-4 w-4" /></button>
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
              <h3 className="text-lg font-bold text-slate-800">{editId ? 'Edit Siswa' : 'Tambah Siswa'}</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600"><X className="h-5 w-5" /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">NIS</label>
                <input value={form.nis} onChange={(e) => setForm({ ...form, nis: e.target.value })} required className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">NISN</label>
                <input value={form.nisn} onChange={(e) => setForm({ ...form, nisn: e.target.value })} required className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Nama Lengkap</label>
                <input value={form.nama_lengkap} onChange={(e) => setForm({ ...form, nama_lengkap: e.target.value })} required className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Jenis Kelamin</label>
                <select value={form.jenis_kelamin} onChange={(e) => setForm({ ...form, jenis_kelamin: e.target.value as JenisKelamin })} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20">
                  <option value="LAKI_LAKI">Laki-laki</option>
                  <option value="PEREMPUAN">Perempuan</option>
                </select>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="rounded-lg border border-slate-300 px-4 py-2 text-sm hover:bg-slate-50">Batal</button>
                <button type="submit" disabled={createSiswa.isPending || updateSiswa.isPending} className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark disabled:opacity-50">
                  {createSiswa.isPending || updateSiswa.isPending ? 'Menyimpan...' : 'Simpan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}