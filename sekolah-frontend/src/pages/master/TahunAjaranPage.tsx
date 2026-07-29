import { useState } from 'react';
import { useTahunAjaran, useCreateTahunAjaran, useActivateTahunAjaran } from '@/hooks/useMasterData';
import type { Semester } from '@/types';
import { Plus, X, CheckCircle } from 'lucide-react';

interface FormData { nama: string; semester: Semester; }
const emptyForm: FormData = { nama: '', semester: 'GANJIL' };

export default function TahunAjaranPage() {
  const { data: taList, isLoading } = useTahunAjaran();
  const createTa = useCreateTahunAjaran();
  const activateTa = useActivateTahunAjaran();
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<FormData>(emptyForm);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createTa.mutate(form, { onSuccess: () => setShowModal(false) });
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-800">Tahun Ajaran</h2>
        <button onClick={() => { setForm(emptyForm); setShowModal(true); }} className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white hover:bg-primary-dark">
          <Plus className="h-4 w-4" /> Tambah
        </button>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50">
            <tr>
              <th className="px-6 py-3 font-semibold text-slate-600">No</th>
              <th className="px-6 py-3 font-semibold text-slate-600">Tahun Ajaran</th>
              <th className="px-6 py-3 font-semibold text-slate-600">Semester</th>
              <th className="px-6 py-3 font-semibold text-slate-600">Status</th>
              <th className="px-6 py-3 font-semibold text-slate-600">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan={5} className="px-6 py-8 text-center text-slate-400">Memuat data...</td></tr>
            ) : !taList?.length ? (
              <tr><td colSpan={5} className="px-6 py-8 text-center text-slate-400">Belum ada data</td></tr>
            ) : (
              taList.map((t, i) => (
                <tr key={t.id} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="px-6 py-3">{i + 1}</td>
                  <td className="px-6 py-3 font-medium">{t.nama}</td>
                  <td className="px-6 py-3">{t.semester}</td>
                  <td className="px-6 py-3">
                    {t.is_active ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-700"><CheckCircle className="h-3 w-3" /> Aktif</span>
                    ) : (
                      <span className="text-slate-400 text-xs">Tidak aktif</span>
                    )}
                  </td>
                  <td className="px-6 py-3">
                    {!t.is_active && (
                      <button onClick={() => activateTa.mutate(t.id)} className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-emerald-700">
                        Aktifkan
                      </button>
                    )}
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
              <h3 className="text-lg font-bold text-slate-800">Tambah Tahun Ajaran</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600"><X className="h-5 w-5" /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Tahun Ajaran</label>
                <input value={form.nama} onChange={(e) => setForm({ ...form, nama: e.target.value })} required placeholder="2024/2025" className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Semester</label>
                <select value={form.semester} onChange={(e) => setForm({ ...form, semester: e.target.value as Semester })} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20">
                  <option value="GANJIL">Ganjil</option>
                  <option value="GENAP">Genap</option>
                </select>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="rounded-lg border border-slate-300 px-4 py-2 text-sm hover:bg-slate-50">Batal</button>
                <button type="submit" disabled={createTa.isPending} className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark disabled:opacity-50">
                  {createTa.isPending ? 'Menyimpan...' : 'Simpan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}