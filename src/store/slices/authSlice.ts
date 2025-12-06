import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { AuthResponse, User } from '../../types/api';
import api from '../../utils/api';
import { AuthStorage } from '../../utils/auth-storage';

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
      console.log('🔐 Tentando fazer login com:', credentials.email);
      const response = await api.post<AuthResponse>(
        '/auth/login',
        credentials
      );
      console.log('✅ Login bem-sucedido:', response.data);
      // Salvar token e user no storage (usando o mesmo token para ambos por enquanto)
      await AuthStorage.setTokens(response.data.token, response.data.token);
      await AuthStorage.setUser(response.data.user);
      return response.data;
    } catch (error: any) {
      console.error('❌ Erro no login:', error);
      console.error('Response:', error.response?.data);
      throw error.response?.data?.message || 'Erro ao fazer login';
    }
  }
);

export const register = createAsyncThunk(
  'auth/register',
  async (userData: { name: string; email: string; cpf: string; password: string }) => {
    try {
      console.log('📝 Tentando registrar usuário:', userData.email);
      const response = await api.post<AuthResponse>(
        '/auth/register',
        userData
      );
      console.log('✅ Registro bem-sucedido:', response.data);
      // Salvar token e user no storage (usando o mesmo token para ambos por enquanto)
      await AuthStorage.setTokens(response.data.token, response.data.token);
      await AuthStorage.setUser(response.data.user);
      return response.data;
    } catch (error: any) {
      console.error('❌ Erro no registro:', error);
      console.error('Response completa:', error.response);
      const errorMessage = error.response?.data?.message || error.message || 'Erro ao registrar usuário';
      console.error('Mensagem de erro:', errorMessage);
      throw errorMessage;
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
    initializeFromStorage: (state, action) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.isLoading = false;
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