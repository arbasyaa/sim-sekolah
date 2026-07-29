import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';
import type { ApiResponse, Guru, Siswa, Mapel, TahunAjaran } from '@/types';

// ===================== GURU =====================
export function useGuru() {
  return useQuery({
    queryKey: ['guru'],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<Guru[]>>('/master/guru');
      return data.data;
    },
  });
}

export function useCreateGuru() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: Omit<Guru, 'id' | 'user_id'>) => {
      const { data } = await api.post<ApiResponse<Guru>>('/master/guru', payload);
      return data.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['guru'] });
    },
  });
}

export function useUpdateGuru() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...payload }: { id: number; nip: string; nama_lengkap: string; no_hp?: string | null }) => {
      const { data } = await api.put<ApiResponse<Guru>>(`/master/guru/${id}`, payload);
      return data.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['guru'] });
    },
  });
}

export function useDeleteGuru() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/master/guru/${id}`);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['guru'] });
    },
  });
}

// ===================== SISWA =====================
export function useSiswa() {
  return useQuery({
    queryKey: ['siswa'],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<Siswa[]>>('/master/siswa');
      return data.data;
    },
  });
}

export function useCreateSiswa() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: Omit<Siswa, 'id'>) => {
      const { data } = await api.post<ApiResponse<Siswa>>('/master/siswa', payload);
      return data.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['siswa'] });
    },
  });
}

export function useUpdateSiswa() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...payload }: Siswa) => {
      const { data } = await api.put<ApiResponse<Siswa>>(`/master/siswa/${id}`, payload);
      return data.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['siswa'] });
    },
  });
}

export function useDeleteSiswa() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/master/siswa/${id}`);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['siswa'] });
    },
  });
}

// ===================== MAPEL =====================
export function useMapel() {
  return useQuery({
    queryKey: ['mapel'],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<Mapel[]>>('/master/mapel');
      return data.data;
    },
  });
}

export function useCreateMapel() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: Omit<Mapel, 'id'>) => {
      const { data } = await api.post<ApiResponse<Mapel>>('/master/mapel', payload);
      return data.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['mapel'] });
    },
  });
}

export function useUpdateMapel() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...payload }: Mapel) => {
      const { data } = await api.put<ApiResponse<Mapel>>(`/master/mapel/${id}`, payload);
      return data.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['mapel'] });
    },
  });
}

export function useDeleteMapel() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/master/mapel/${id}`);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['mapel'] });
    },
  });
}

// ===================== TAHUN AJARAN =====================
export function useTahunAjaran() {
  return useQuery({
    queryKey: ['tahun-ajaran'],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<TahunAjaran[]>>('/master/tahun-ajaran');
      return data.data;
    },
  });
}

export function useCreateTahunAjaran() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: Omit<TahunAjaran, 'id' | 'is_active'>) => {
      const { data } = await api.post<ApiResponse<TahunAjaran>>('/master/tahun-ajaran', payload);
      return data.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['tahun-ajaran'] });
    },
  });
}

export function useActivateTahunAjaran() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const { data } = await api.patch<ApiResponse<TahunAjaran>>(`/master/tahun-ajaran/${id}/activate`);
      return data.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['tahun-ajaran'] });
    },
  });
}