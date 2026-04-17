import { useAuthStore } from '@/store/authStore';
import axios, { AxiosInstance } from 'axios';
import { useEffect, useRef } from 'react';

export const useApi = (): AxiosInstance => {
  const apiRef = useRef<AxiosInstance | null>(null);
  const { token } = useAuthStore();

  useEffect(() => {
    const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

    const api = axios.create({
      baseURL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add request interceptor to include token
    api.interceptors.request.use((config) => {
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    // Add response interceptor for error handling
    api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Token expired, logout user
          useAuthStore.getState().logout();
          // Redirect to login
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );

    apiRef.current = api;
  }, [token]);

  return apiRef.current || axios;
};
