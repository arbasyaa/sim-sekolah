import { Menu } from 'lucide-react';

interface HeaderProps {
  onToggleSidebar: () => void;
}

export default function Header({ onToggleSidebar }: HeaderProps) {
  return (
    <header className="flex h-16 items-center gap-4 border-b border-slate-200 bg-white px-6 shadow-sm">
      <button
        onClick={onToggleSidebar}
        className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
      >
        <Menu className="h-5 w-5" />
      </button>
      <h1 className="text-lg font-semibold text-slate-800">
        Sistem Informasi Manajemen Sekolah
      </h1>
    </header>
  );
}