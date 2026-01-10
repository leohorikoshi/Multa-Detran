/**
 * Paleta de Cores - DetranDenuncia
 * Padrão Detran-SP Profissional
 * Contraste WCAG AA: 4.5:1
 */

export const Colors = {
  light: {
    // Primary Colors - Detran-SP
    primary: '#1565C0',      // Azul Detran-SP profissional
    primaryDark: '#0D47A1',  // Azul escuro
    primaryLight: '#1976D2', // Azul médio
    
    // Secondary Colors
    secondary: '#1976D2',    // Azul secundário
    secondaryDark: '#1565C0',
    secondaryLight: '#42A5F5',
    
    // Support Colors
    supportGreen: '#43A047', // Verde profissional
    supportRed: '#E53935',   // Vermelho profissional
    
    // Background
    background: '#F5F7FA',   // Cinza muito claro
    backgroundSecondary: '#FFFFFF',
    backgroundTertiary: '#FAFBFC',
    
    // Surface
    surface: '#FFFFFF',
    surfaceElevated: '#FFFFFF',
    
    // Text
    text: '#212121',         // Texto principal
    textSecondary: '#616161',
    textTertiary: '#9E9E9E',
    textInverse: '#FFFFFF',
    
    // Border
    border: '#E0E0E0',       // Borda suave
    borderLight: '#F5F5F5',
    
    // Status
    success: '#43A047',      // Verde
    successLight: '#E8F5E9',
    successDark: '#2E7D32',
    warning: '#FB8C00',      // Laranja
    warningLight: '#FFF3E0',
    warningDark: '#E65100',
    error: '#E53935',        // Vermelho
    errorLight: '#FFEBEE',
    errorDark: '#C62828',
    info: '#1976D2',         // Azul
    infoLight: '#E3F2FD',
    infoDark: '#1565C0',
    
    // Violation Status
    pending: '#FB8C00',      // Laranja
    approved: '#43A047',     // Verde
    rejected: '#E53935',     // Vermelho
    analyzing: '#1976D2',    // Azul
    
    // Overlay
    overlay: 'rgba(0, 0, 0, 0.5)',
    overlayLight: 'rgba(0, 0, 0, 0.2)',
    
    // Card
    card: '#FFFFFF',
    cardShadow: 'rgba(0, 0, 0, 0.1)',
  },
  
  dark: {
    // Primary Colors - Detran-SP Dark
    primary: '#42A5F5',      // Azul claro para dark
    primaryDark: '#1976D2',  // Azul médio
    primaryLight: '#64B5F6',
    
    // Secondary Colors
    secondary: '#42A5F5',    // Azul secundário
    secondaryDark: '#1976D2',
    secondaryLight: '#64B5F6',
    
    // Support Colors
    supportGreen: '#66BB6A', // Verde claro
    supportRed: '#EF5350',   // Vermelho claro
    
    // Background
    background: '#121212',   // Preto suave
    backgroundSecondary: '#1E1E1E',
    backgroundTertiary: '#2C2C2C',
    
    // Surface
    surface: '#1E1E1E',
    surfaceElevated: '#2C2C2C',
    
    // Text
    text: '#FFFFFF',
    textSecondary: '#B0B0B0',
    textTertiary: '#808080',
    textInverse: '#121212',
    
    // Border
    border: '#3C3C3C',
    borderLight: '#2C2C2C',
    
    // Status
    success: '#66BB6A',
    successLight: '#1B3A1F',
    successDark: '#A5D6A7',
    warning: '#FFA726',
    warningLight: '#3A2E1F',
    warningDark: '#FFB74D',
    error: '#EF5350',
    errorLight: '#3A1F1F',
    errorDark: '#E57373',
    info: '#42A5F5',
    infoLight: '#1A2F3A',
    infoDark: '#90CAF9',
    
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
