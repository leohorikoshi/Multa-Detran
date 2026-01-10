import AsyncStorage from '@react-native-async-storage/async-storage';
import { isWeb } from './platform';

const AUTH_TOKEN_KEY = '@DetranDenuncia:token';
const REFRESH_TOKEN_KEY = '@DetranDenuncia:refreshToken';
const USER_DATA_KEY = '@DetranDenuncia:user';

// Helper para funcionar tanto na web quanto no mobile
const storage = {
  async setItem(key: string, value: string): Promise<void> {
    if (isWeb) {
      localStorage.setItem(key, value);
    } else {
      await AsyncStorage.setItem(key, value);
    }
  },
  
  async getItem(key: string): Promise<string | null> {
    if (isWeb) {
      return localStorage.getItem(key);
    } else {
      return await AsyncStorage.getItem(key);
    }
  },
  
  async removeItem(key: string): Promise<void> {
    if (isWeb) {
      localStorage.removeItem(key);
    } else {
      await AsyncStorage.removeItem(key);
    }
  },
  
  async clear(): Promise<void> {
    if (isWeb) {
      localStorage.clear();
    } else {
      await AsyncStorage.clear();
    }
  }
};

export const AuthStorage = {
  async setTokens(token: string, refreshToken: string): Promise<void> {
    try {
      console.log('💾 Salvando tokens no storage...');
      await Promise.all([
        storage.setItem(AUTH_TOKEN_KEY, token),
        storage.setItem(REFRESH_TOKEN_KEY, refreshToken)
      ]);
      console.log('✅ Tokens salvos com sucesso');
    } catch (error) {
      console.error('❌ Erro ao salvar tokens:', error);
    }
  },

  async getToken(): Promise<string | null> {
    try {
      const token = await storage.getItem(AUTH_TOKEN_KEY);
      console.log('🔍 Token recuperado:', token ? 'Presente' : 'Ausente');
      return token;
    } catch (error) {
      console.error('Erro ao recuperar token:', error);
      return null;
    }
  },

  async getRefreshToken(): Promise<string | null> {
    try {
      return await storage.getItem(REFRESH_TOKEN_KEY);
    } catch (error) {
      console.error('Erro ao recuperar refresh token:', error);
      return null;
    }
  },

  async setUser(user: any): Promise<void> {
    try {
      console.log('💾 Salvando usuário no storage:', user.email);
      await storage.setItem(USER_DATA_KEY, JSON.stringify(user));
      console.log('✅ Usuário salvo com sucesso');
    } catch (error) {
      console.error('❌ Erro ao salvar dados do usuário:', error);
    }
  },

  async getUser(): Promise<any | null> {
    try {
      const userData = await storage.getItem(USER_DATA_KEY);
      const user = userData ? JSON.parse(userData) : null;
      console.log('🔍 Usuário recuperado:', user?.email || 'Nenhum');
      return user;
    } catch (error) {
      console.error('Erro ao recuperar dados do usuário:', error);
      return null;
    }
  },

  async clear(): Promise<void> {
    try {
      console.log('🗑️ Limpando storage...');
      await Promise.all([
        storage.removeItem(AUTH_TOKEN_KEY),
        storage.removeItem(REFRESH_TOKEN_KEY),
        storage.removeItem(USER_DATA_KEY),
      ]);
      console.log('✅ Storage limpo');
    } catch (error) {
      console.error('Erro ao limpar dados de autenticação:', error);
    }
  }
};