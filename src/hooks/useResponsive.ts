import { useState, useEffect } from 'react';
import { Dimensions } from 'react-native';
import { isWeb as platformIsWeb } from '../utils/platform';

interface ResponsiveBreakpoints {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isWeb: boolean;
  width: number;
  height: number;
  orientation: 'portrait' | 'landscape';
}

export const useResponsive = (): ResponsiveBreakpoints => {
  const [dimensions, setDimensions] = useState({
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  });

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setDimensions({
        width: window.width,
        height: window.height,
      });
    });

    return () => subscription?.remove();
  }, []);

  const { width, height } = dimensions;
  const isWeb = platformIsWeb;

  // Breakpoints
  const isMobile = width < 768;
  const isTablet = width >= 768 && width < 1024;
  const isDesktop = width >= 1024;
  const orientation = width > height ? 'landscape' : 'portrait';

  return {
    isMobile,
    isTablet,
    isDesktop,
    isWeb,
    width,
    height,
    orientation,
  };
};

// Helper para criar estilos responsivos
export const responsive = {
  // Padding/Margin responsivo
  spacing: (mobile: number, tablet?: number, desktop?: number) => {
    const { isMobile, isTablet, isDesktop } = useResponsive();
    if (isDesktop && desktop !== undefined) return desktop;
    if (isTablet && tablet !== undefined) return tablet;
    return mobile;
  },
  
  // Font size responsivo
  fontSize: (mobile: number, tablet?: number, desktop?: number) => {
    const { isMobile, isTablet, isDesktop } = useResponsive();
    if (isDesktop && desktop !== undefined) return desktop;
    if (isTablet && tablet !== undefined) return tablet;
    return mobile;
  },
};
