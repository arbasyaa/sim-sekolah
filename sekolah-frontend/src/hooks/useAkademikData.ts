import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';
import type { ApiResponse, PengampuMapel, Presensi, Nilai, Rombel } from '@/types';

// ================= ROMBEL =================
export const useRombel = () => {
  return useQuery({
    queryKey: ['rombel'],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<Rombel[]>>(`/akademik/rombel`);
      return data.data;
    },
  });
};

export const useRombelById = (rombelId?: number | null) => {
  return useQuery({
    queryKey: ['rombel', rombelId],
    queryFn: async () => {
      if (!rombelId) return null;
      const { data } = await api.get<ApiResponse<Rombel>>(`/akademik/rombel/${rombelId}`);
      return data.data;
    },
    enabled: !!rombelId,
  });
};

// ================= JADWAL / PENGAMPU MAPEL =================

export const usePengampuGuru = (guruId?: number | null) => {
  return useQuery({
    queryKey: ['pengampu', guruId],
    queryFn: async () => {
      if (!guruId) return [];
      const { data } = await api.get<ApiResponse<PengampuMapel[]>>(`/akademik/pengampu/guru/${guruId}`);
      return data.data;
    },
    enabled: !!guruId,
  });
};

export const useJadwalGuru = (guruId?: number | null) => {
  return useQuery({
    queryKey: ['jadwal', 'guru', guruId],
    queryFn: async () => {
      if (!guruId) return [];
      const { data } = await api.get<ApiResponse<any[]>>(`/akademik/jadwal?guru_id=${guruId}`);
      return data.data;
    },
    enabled: !!guruId,
  });
};

export const useJadwalRombel = (rombelId?: number | null) => {
  return useQuery({
    queryKey: ['jadwal', 'rombel', rombelId],
    queryFn: async () => {
      if (!rombelId) return [];
      const { data } = await api.get<ApiResponse<any[]>>(`/akademik/jadwal?rombel_id=${rombelId}`);
      return data.data;
    },
    enabled: !!rombelId,
  });
};

interface CreateJadwalPayload {
  pengampu_mapel_id: number;
  hari: string;
  jam_mulai: string;
  jam_selesai: string;
}

export const useCreateJadwal = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: CreateJadwalPayload) => {
      const { data } = await api.post<ApiResponse<any>>('/akademik/jadwal', payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jadwal'] });
    },
  });
};

export const useDeleteJadwal = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const { data } = await api.delete<ApiResponse<any>>(`/akademik/jadwal/${id}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jadwal'] });
    },
  });
};

// ================= PRESENSI =================

export const usePresensiJadwal = (jadwalId?: number | null | '', tanggal?: string) => {
  return useQuery({
    queryKey: ['presensi', jadwalId, tanggal],
    queryFn: async () => {
      if (!jadwalId) return [];
      const { data } = await api.get<ApiResponse<Presensi[]>>(`/akademik/presensi`, {
        params: { jadwal_id: jadwalId, tanggal }
      });
      return data.data;
    },
    enabled: !!jadwalId,
  });
};

interface InputPresensiPayload {
  jadwal_id: number;
  tanggal: string;
  items: { anggota_rombel_id: number; status: string }[];
}

export const useInputPresensi = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: InputPresensiPayload) => {
      const { data } = await api.post<ApiResponse<any>>('/akademik/presensi', payload);
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['presensi', variables.jadwal_id] });
    },
  });
};

// ================= NILAI =================

export const useNilaiRombel = (rombelId?: number | null, pengampuMapelId?: number | null) => {
  return useQuery({
    queryKey: ['nilai', rombelId, pengampuMapelId],
    queryFn: async () => {
      if (!rombelId) return [];
      // Pass pengampuMapelId in params if we only want nilai for specific mapel
      const { data } = await api.get<ApiResponse<Nilai[]>>(`/akademik/nilai/rombel/${rombelId}`, {
        params: { pengampu_mapel_id: pengampuMapelId }
      });
      return data.data;
    },
    enabled: !!rombelId,
  });
};

interface InputNilaiPayload {
  rombel_id: number;
  pengampu_mapel_id: number;
  jenis_nilai: string;
  urutan: number;
  nilai: { anggota_rombel_id: number; skor: number }[];
}

export const useInputNilai = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: InputNilaiPayload) => {
      const items = payload.nilai.map((n) => ({
        anggota_rombel_id: n.anggota_rombel_id,
        pengampu_mapel_id: payload.pengampu_mapel_id,
        jenis_nilai: payload.jenis_nilai,
        urutan: payload.urutan,
        skor: n.skor,
      }));
      const { data } = await api.post<ApiResponse<any>>('/akademik/nilai', { items });
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['nilai', variables.rombel_id] });
      queryClient.invalidateQueries({ queryKey: ['rekap-raport', variables.rombel_id] });
    },
  });
};

// ================= REKAP RAPORT =================

export const useRekapRaport = (rombelId?: number | null) => {
  return useQuery({
    queryKey: ['rekap-raport', rombelId],
    queryFn: async () => {
      if (!rombelId) return [];
      const { data } = await api.get<ApiResponse<any>>(`/akademik/rekap/rombel/${rombelId}`);
      return data.data;
    },
    enabled: !!rombelId,
  });
};