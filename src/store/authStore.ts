import { create } from 'zustand';
import { User, AuthResponse } from '@/types';

interface AuthStore {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  login: (response: AuthResponse) => void;
  logout: () => void;
  isAuthenticated: () => boolean;
  hydrate: () => void; // Load from localStorage
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  token: null,
  isLoading: false,
  error: null,

  setUser: (user) => set({ user }),
  setToken: (token) => set({ token }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),

  login: (response) => {
    const { access_token, user } = response;
    set({ user, token: access_token, error: null });
    // Persist to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', access_token);
      localStorage.setItem('auth_user', JSON.stringify(user));
    }
  },

  logout: () => {
    set({ user: null, token: null, error: null });
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
    }
  },

  isAuthenticated: () => {
    const { token } = get();
    return token !== null;
  },

  hydrate: () => {
    if (typeof window === 'undefined') return;
    const token = localStorage.getItem('auth_token');
    const user = localStorage.getItem('auth_user');
    if (token && user) {
      set({ token, user: JSON.parse(user) });
    }
  },
}));
