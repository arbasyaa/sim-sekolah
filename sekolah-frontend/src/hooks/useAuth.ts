import { useMutation } from '@tanstack/react-query';
import api from '@/lib/axios';
import { useAuthStore } from '@/store/authStore';
import type { ApiResponse, LoginData, LoginPayload } from '@/types';

export function useLogin() {
  const setAuth = useAuthStore((s) => s.setAuth);

  return useMutation({
    mutationFn: async (payload: LoginPayload) => {
      const { data } = await api.post<ApiResponse<LoginData>>('/auth/login', payload);
      return data.data;
    },
    onSuccess: (data) => {
      setAuth(data.token, data.user);
    },
  });
}