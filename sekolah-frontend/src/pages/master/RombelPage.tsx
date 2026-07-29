import { School } from 'lucide-react';

export default function RombelPage() {
  return (
    <div>
      <h2 className="mb-6 text-2xl font-bold text-slate-800">Rombel (Kelas)</h2>
      <div className="flex flex-col items-center justify-center rounded-xl border border-slate-200 bg-white py-16 shadow-sm">
        <School className="mb-4 h-16 w-16 text-slate-300" />
        <p className="text-lg font-medium text-slate-500">Fitur Rombel akan segera hadir</p>
        <p className="mt-1 text-sm text-slate-400">Halaman ini sedang dalam pengembangan</p>
      </div>
    </div>
  );
}