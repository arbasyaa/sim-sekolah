import { createBrowserRouter } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import LoginPage from '@/pages/LoginPage';
import DashboardPage from '@/pages/DashboardPage';
import GuruPage from '@/pages/master/GuruPage';
import SiswaPage from '@/pages/master/SiswaPage';
import MapelPage from '@/pages/master/MapelPage';
import TahunAjaranPage from '@/pages/master/TahunAjaranPage';
import RombelPage from '@/pages/master/RombelPage';
import JadwalPage from '@/pages/akademik/JadwalPage';
import PresensiPage from '@/pages/akademik/PresensiPage';
import NilaiPage from '@/pages/akademik/NilaiPage';
import RaportPage from '@/pages/akademik/RaportPage';

export const router = createBrowserRouter([
  { path: '/login', element: <LoginPage /> },
  {
    path: '/',
    element: <DashboardLayout />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: 'dashboard', element: <DashboardPage /> },
      { path: 'guru', element: <GuruPage /> },
      { path: 'siswa', element: <SiswaPage /> },
      { path: 'mapel', element: <MapelPage /> },
      { path: 'tahun-ajaran', element: <TahunAjaranPage /> },
      { path: 'rombel', element: <RombelPage /> },
      
      { path: 'jadwal', element: <JadwalPage /> },
      { path: 'presensi', element: <PresensiPage /> },
      { path: 'nilai', element: <NilaiPage /> },
      { path: 'raport', element: <RaportPage /> },
    ],
  },
]);
