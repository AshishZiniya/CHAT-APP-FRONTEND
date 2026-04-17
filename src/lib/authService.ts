import axios from 'axios';
import { AuthResponse, LoginCredentials, RegisterCredentials } from '@/types';

const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

const authApi = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const authService = {
  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    const response = await authApi.post('/auth/register', credentials);
    return response.data;
  },

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await authApi.post('/auth/login', credentials);
    return response.data;
  },

  async getProfile(token: string) {
    const response = await authApi.get('/auth/profile', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },
};
