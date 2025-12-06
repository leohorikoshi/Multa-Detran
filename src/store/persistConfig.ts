import { persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { combineReducers } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import violationsReducer from './slices/violationsSlice';

// Configuração de persistência
const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['auth', 'violations'], // Apenas estas slices serão persistidas
  blacklist: [], // Slices que NÃO devem ser persistidas
};

// Configuração específica para violations (cache offline)
const violationsPersistConfig = {
  key: 'violations',
  storage: AsyncStorage,
  whitelist: ['cachedViolations', 'lastSync'], // Cache de denúncias
};

const rootReducer = combineReducers({
  auth: authReducer,
  violations: persistReducer(violationsPersistConfig, violationsReducer),
});

export const persistedReducer = persistReducer(persistConfig, rootReducer);
