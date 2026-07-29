import { NavLink } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  BookOpen,
  Calendar,
  School,
  ClipboardList,
  FileText,
  LogOut,
} from 'lucide-react';

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

const adminMenus = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/guru', label: 'Data Guru', icon: Users },
  { to: '/siswa', label: 'Data Siswa', icon: GraduationCap },
  { to: '/mapel', label: 'Mata Pelajaran', icon: BookOpen },
  { to: '/tahun-ajaran', label: 'Tahun Ajaran', icon: Calendar },
  { to: '/rombel', label: 'Rombel (Kelas)', icon: School },
  { to: '/jadwal', label: 'Jadwal Pelajaran', icon: Calendar },
];

const guruMenus = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/jadwal', label: 'Jadwal Pelajaran', icon: Calendar },
  { to: '/presensi', label: 'Presensi', icon: ClipboardList },
  { to: '/nilai', label: 'Input Nilai & Cetak', icon: FileText },
];

export default function Sidebar({ open, onClose }: SidebarProps) {
  const { user, logout } = useAuthStore();
  const isGuru = user?.role === 'GURU';
  const menus = isGuru ? guruMenus : adminMenus;

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  return (
    <>
      {/* Overlay mobile */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={cn(
          'fixed top-0 left-0 z-50 flex h-full w-64 flex-col bg-sidebar text-white transition-transform duration-300 lg:relative lg:translate-x-0',
          open ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Logo */}
        <div className="flex h-16 items-center gap-3 border-b border-white/10 px-6">
          <School className="h-7 w-7 text-primary-light" />
          <span className="text-lg font-bold">SIM Sekolah</span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <ul className="space-y-1">
            {menus.map((m) => (
              <li key={m.to}>
                <NavLink
                  to={m.to}
                  onClick={onClose}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-primary text-white'
                        : 'text-slate-300 hover:bg-white/10 hover:text-white'
                    )
                  }
                >
                  <m.icon className="h-5 w-5" />
                  {m.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* User info & logout */}
        <div className="border-t border-white/10 p-4">
          <div className="mb-3 text-xs text-slate-400">
            <p className="font-semibold text-white">{user?.username}</p>
            <p>{user?.role}</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-300 transition-colors hover:bg-red-600/20 hover:text-red-400"
          >
            <LogOut className="h-4 w-4" />
            Keluar
          </button>
        </div>
      </aside>
    </>
  );
}