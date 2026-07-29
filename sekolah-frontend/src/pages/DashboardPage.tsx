import { useAuthStore } from '@/store/authStore';
import { useGuru, useSiswa, useMapel, useTahunAjaran } from '@/hooks/useMasterData';
import { Users, GraduationCap, BookOpen, Calendar } from 'lucide-react';

function StatCard({ icon: Icon, label, value, color }: { icon: React.ElementType; label: string; value: number | string; color: string }) {
  return (
    <div className="rounded-xl bg-white p-6 shadow-sm border border-slate-100">
      <div className="flex items-center gap-4">
        <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${color}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
        <div>
          <p className="text-sm text-slate-500">{label}</p>
          <p className="text-2xl font-bold text-slate-800">{value}</p>
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const user = useAuthStore((s) => s.user);
  const { data: guru } = useGuru();
  const { data: siswa } = useSiswa();
  const { data: mapel } = useMapel();
  const { data: tahunAjaran } = useTahunAjaran();

  const activeTa = tahunAjaran?.find((t) => t.is_active);

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-800">Dashboard</h2>
        <p className="text-slate-500">
          Selamat datang, <span className="font-semibold">{user?.username}</span>!
          {activeTa && (
            <span className="ml-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              {activeTa.nama} — {activeTa.semester}
            </span>
          )}
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={Users} label="Total Guru" value={guru?.length ?? '—'} color="bg-blue-600" />
        <StatCard icon={GraduationCap} label="Total Siswa" value={siswa?.length ?? '—'} color="bg-emerald-600" />
        <StatCard icon={BookOpen} label="Mata Pelajaran" value={mapel?.length ?? '—'} color="bg-amber-600" />
        <StatCard icon={Calendar} label="Tahun Ajaran" value={tahunAjaran?.length ?? '—'} color="bg-purple-600" />
      </div>
    </div>
  );
}