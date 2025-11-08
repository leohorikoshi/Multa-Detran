import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { AuthResponse, User } from '../types/api';
import api from '../utils/api';
import { AuthStorage } from '../utils/auth-storage';

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isLoading: false,
  error: null,
};

export const login = createAsyncThunk(
  'auth/login',
  async (credentials: { email: string; password: string }) => {
    try {
      const response = await api.post<AuthResponse>(
        '/auth/login',
        credentials
      );
      // Salvar token e user no storage
      await AuthStorage.setToken(response.data.token);
      await AuthStorage.setUser(response.data.user);
      return response.data;
    } catch (error: any) {
      throw error.response?.data?.message || 'Erro ao fazer login';
    }
  }
);

export const register = createAsyncThunk(
  'auth/register',
  async (userData: { name: string; email: string; cpf: string; password: string }) => {
    try {
      const response = await api.post<AuthResponse>(
        '/auth/register',
        userData
      );
      // Salvar token e user no storage
      await AuthStorage.setToken(response.data.token);
      await AuthStorage.setUser(response.data.user);
      return response.data;
    } catch (error: any) {
      throw error.response?.data?.message || 'Erro ao registrar usuário';
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.error = null;
      // Limpar storage
      AuthStorage.clear();
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Erro desconhecido';
      })
      // Register
      .addCase(register.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Erro desconhecido';
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;