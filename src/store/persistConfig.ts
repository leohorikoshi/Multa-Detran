import { persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { combineReducers } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import violationsReducer from './slices/violationsSlice';
import { Platform } from 'react-native';

// Storage para web usa localStorage
const webStorage = {
  getItem: async (key: string) => {
    try {
      return localStorage.getItem(key);
    } catch (e) {
      console.error('Error getting item from localStorage:', e);
      return null;
    }
  },
  setItem: async (key: string, value: string) => {
    try {
      localStorage.setItem(key, value);
    } catch (e) {
      console.error('Error setting item to localStorage:', e);
    }
  },
  removeItem: async (key: string) => {
    try {
      localStorage.removeItem(key);
    } catch (e) {
      console.error('Error removing item from localStorage:', e);
    }
  },
};

// Usar localStorage na web, AsyncStorage no mobile
const storage = Platform.OS === 'web' ? webStorage : AsyncStorage;

// Configuração de persistência
const persistConfig = {
  key: 'root',
  storage: storage,
  whitelist: ['auth', 'violations'], // Apenas estas slices serão persistidas
  blacklist: [], // Slices que NÃO devem ser persistidas
};

// Configuração específica para violations (cache offline)
const violationsPersistConfig = {
  key: 'violations',
  storage: storage,
  whitelist: ['cachedViolations', 'lastSync'], // Cache de denúncias
};

const rootReducer = combineReducers({
  auth: authReducer,
  violations: persistReducer(violationsPersistConfig, violationsReducer),
});

export const persistedReducer = persistReducer(persistConfig, rootReducer);
