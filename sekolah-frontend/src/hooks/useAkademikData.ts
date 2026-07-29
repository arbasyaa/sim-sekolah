import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';
import type { ApiResponse, PengampuMapel, Presensi, Nilai, Rombel } from '@/types';

// ================= ROMBEL =================
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

// ================= PENGAMPU MAPEL =================

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

// ================= PRESENSI =================

export const usePresensiRombel = (rombelId?: number | null, tanggal?: string) => {
  return useQuery({
    queryKey: ['presensi', rombelId, tanggal],
    queryFn: async () => {
      if (!rombelId || !tanggal) return [];
      const { data } = await api.get<ApiResponse<Presensi[]>>(`/akademik/presensi/rombel/${rombelId}`, {
        params: { tanggal }
      });
      return data.data;
    },
    enabled: !!rombelId && !!tanggal,
  });
};

interface InputPresensiPayload {
  rombel_id: number;
  tanggal: string;
  presensi: { anggota_rombel_id: number; status: string }[];
}

export const useInputPresensi = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: InputPresensiPayload) => {
      const { data } = await api.post<ApiResponse<any>>('/akademik/presensi', payload);
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['presensi', variables.rombel_id, variables.tanggal] });
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