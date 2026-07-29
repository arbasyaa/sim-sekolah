import { create } from 'zustand';
import type { UserData } from '@/types';

interface AuthState {
  token: string | null;
  user: UserData | null;
  setAuth: (token: string, user: UserData) => void;
  logout: () => void;
  isAuthenticated: () => boolean;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  token: localStorage.getItem('token'),
  user: (() => {
    const raw = localStorage.getItem('user');
    if (!raw) return null;
    try {
      return JSON.parse(raw) as UserData;
    } catch {
      return null;
    }
  })(),

  setAuth: (token: string, user: UserData) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    set({ token, user });
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    set({ token: null, user: null });
  },

  isAuthenticated: () => {
    return !!get().token;
  },
}));