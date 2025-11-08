import axios from 'axios';
import { API_BASE_URL } from '../constants';
import { AuthStorage } from './auth-storage';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  async (config) => {
    const token = await AuthStorage.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Se o erro for 401 e não estivermos já tentando refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Tentar refresh do token
        const refreshToken = await AuthStorage.getRefreshToken();
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
          refreshToken,
        });

        const { accessToken, refreshToken: newRefreshToken } = response.data;
        
        // Salvar novos tokens
        await AuthStorage.setTokens(accessToken, newRefreshToken);
        
        // Atualizar header e refazer requisição original
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Se falhar o refresh, limpar dados e redirecionar para login
        await AuthStorage.clear();
        // Dispatch logout action aqui se necessário
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;