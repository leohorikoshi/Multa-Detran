/**
 * Theme Context - Gerenciamento de tema (Light/Dark Mode)
 * Suporta: Light, Dark, e Auto (sistema)
 * Persistência com AsyncStorage
 */

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Appearance, ColorSchemeName, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors, Gradients, Shadows, ColorScheme, ThemeColors, ThemeGradients, ThemeShadows } from '../constants/colors';

const THEME_STORAGE_KEY = '@DetranDenuncia:theme';

export type ThemeMode = 'light' | 'dark' | 'auto';

interface ThemeContextData {
  theme: ColorScheme;
  themeMode: ThemeMode;
  colors: ThemeColors;
  gradients: ThemeGradients;
  shadows: ThemeShadows;
  setThemeMode: (mode: ThemeMode) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextData>({} as ThemeContextData);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [themeMode, setThemeModeState] = useState<ThemeMode>('auto');
  const [theme, setTheme] = useState<ColorScheme>('light');

  // Carrega tema salvo do AsyncStorage
  useEffect(() => {
    loadTheme();
  }, []);

  // Escuta mudanças do tema do sistema
  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      if (themeMode === 'auto') {
        setTheme(colorScheme === 'dark' ? 'dark' : 'light');
      }
    });

    return () => subscription.remove();
  }, [themeMode]);

  // Aplica tema baseado no modo selecionado
  useEffect(() => {
    if (themeMode === 'auto') {
      const systemTheme = Appearance.getColorScheme();
      setTheme(systemTheme === 'dark' ? 'dark' : 'light');
    } else {
      setTheme(themeMode);
    }
  }, [themeMode]);

  const loadTheme = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
      if (savedTheme) {
        setThemeModeState(savedTheme as ThemeMode);
        console.log('🎨 Theme carregado:', savedTheme);
      } else {
        const systemTheme = Appearance.getColorScheme();
        setThemeModeState('auto');
        console.log('🎨 Theme: Usando automático (sistema)');
      }
    } catch (error) {
      console.error('Erro ao carregar tema:', error);
      setThemeModeState('auto');
    }
  };

  const setThemeMode = async (mode: ThemeMode) => {
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, mode);
      setThemeModeState(mode);
      console.log('✅ Tema alterado para:', mode);
    } catch (error) {
      console.error('Erro ao salvar tema:', error);
    }
  };

  const toggleTheme = () => {
    const nextMode: ThemeMode = themeMode === 'light' ? 'dark' : themeMode === 'dark' ? 'auto' : 'light';
    setThemeMode(nextMode);
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        themeMode,
        colors: Colors[theme],
        gradients: Gradients[theme],
        shadows: Shadows[theme],
        setThemeMode,
        toggleTheme,
      }}
    >
      <View key={theme} style={{ flex: 1 }}>
        {children}
      </View>
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextData => {
  const context = useContext(ThemeContext);
  
  if (!context) {
    throw new Error('useTheme deve ser usado dentro de um ThemeProvider');
  }
  
  return context;
};
