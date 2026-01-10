/**
 * Utilitário para detectar a plataforma de forma segura
 * Evita erros com PlatformConstants no Expo web
 */

// Detecta se está rodando no navegador
export const isWeb = typeof window !== 'undefined' && typeof document !== 'undefined';

// Detecta se está rodando no React Native
export const isNative = !isWeb;

// Para compatibilidade com código existente
export const platformOS = isWeb ? 'web' : 'native';

/**
 * Retorna um valor baseado na plataforma
 */
export function platformSelect<T>(options: { web?: T; native?: T; default: T }): T {
  if (isWeb && options.web !== undefined) {
    return options.web;
  }
  if (isNative && options.native !== undefined) {
    return options.native;
  }
  return options.default;
}
