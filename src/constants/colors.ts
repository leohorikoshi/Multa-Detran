/**
 * Paleta de Cores - DetranDenuncia
 * Suporte a Light Mode e Dark Mode
 * Contraste WCAG AA: 4.5:1
 */

export const Colors = {
  light: {
    // Primary Colors
    primary: '#1E88E5',      // Azul principal
    primaryDark: '#1565C0',
    primaryLight: '#42A5F5',
    
    // Secondary Colors
    secondary: '#FF6F00',    // Laranja para alertas
    secondaryDark: '#E65100',
    secondaryLight: '#FF9800',
    
    // Background
    background: '#FFFFFF',
    backgroundSecondary: '#F5F5F5',
    backgroundTertiary: '#EEEEEE',
    
    // Surface
    surface: '#FFFFFF',
    surfaceElevated: '#FAFAFA',
    
    // Text
    text: '#212121',
    textSecondary: '#757575',
    textTertiary: '#9E9E9E',
    textInverse: '#FFFFFF',
    
    // Border
    border: '#E0E0E0',
    borderLight: '#F5F5F5',
    
    // Status
    success: '#4CAF50',
    warning: '#FFC107',
    error: '#F44336',
    info: '#2196F3',
    
    // Violation Status
    pending: '#FFC107',      // Amarelo
    approved: '#4CAF50',     // Verde
    rejected: '#F44336',     // Vermelho
    analyzing: '#2196F3',    // Azul
    
    // Overlay
    overlay: 'rgba(0, 0, 0, 0.5)',
    overlayLight: 'rgba(0, 0, 0, 0.2)',
    
    // Card
    card: '#FFFFFF',
    cardShadow: 'rgba(0, 0, 0, 0.1)',
  },
  
  dark: {
    // Primary Colors
    primary: '#42A5F5',      // Azul mais claro para dark mode
    primaryDark: '#1E88E5',
    primaryLight: '#64B5F6',
    
    // Secondary Colors
    secondary: '#FF9800',    // Laranja mais suave
    secondaryDark: '#F57C00',
    secondaryLight: '#FFB74D',
    
    // Background
    background: '#121212',
    backgroundSecondary: '#1E1E1E',
    backgroundTertiary: '#2C2C2C',
    
    // Surface
    surface: '#1E1E1E',
    surfaceElevated: '#2C2C2C',
    
    // Text
    text: '#FFFFFF',
    textSecondary: '#B0B0B0',
    textTertiary: '#757575',
    textInverse: '#121212',
    
    // Border
    border: '#3C3C3C',
    borderLight: '#2C2C2C',
    
    // Status
    success: '#66BB6A',
    warning: '#FFD54F',
    error: '#EF5350',
    info: '#42A5F5',
    
    // Violation Status
    pending: '#FFD54F',      // Amarelo claro
    approved: '#66BB6A',     // Verde claro
    rejected: '#EF5350',     // Vermelho claro
    analyzing: '#42A5F5',    // Azul claro
    
    // Overlay
    overlay: 'rgba(0, 0, 0, 0.7)',
    overlayLight: 'rgba(0, 0, 0, 0.4)',
    
    // Card
    card: '#1E1E1E',
    cardShadow: 'rgba(0, 0, 0, 0.3)',
  },
};

// Gradients
export const Gradients = {
  light: {
    primary: ['#1E88E5', '#1565C0'],
    secondary: ['#FF6F00', '#E65100'],
    success: ['#4CAF50', '#388E3C'],
    header: ['#1E88E5', '#1976D2'],
  },
  dark: {
    primary: ['#42A5F5', '#1E88E5'],
    secondary: ['#FF9800', '#F57C00'],
    success: ['#66BB6A', '#4CAF50'],
    header: ['#2C2C2C', '#1E1E1E'],
  },
};

// Shadows
export const Shadows = {
  light: {
    small: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 2,
    },
    medium: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.15,
      shadowRadius: 4,
      elevation: 4,
    },
    large: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      elevation: 8,
    },
  },
  dark: {
    small: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.3,
      shadowRadius: 2,
      elevation: 2,
    },
    medium: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.4,
      shadowRadius: 4,
      elevation: 4,
    },
    large: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.5,
      shadowRadius: 8,
      elevation: 8,
    },
  },
};

export type ColorScheme = 'light' | 'dark';
export type ThemeColors = typeof Colors.light;
export type ThemeGradients = typeof Gradients.light;
export type ThemeShadows = typeof Shadows.light;
