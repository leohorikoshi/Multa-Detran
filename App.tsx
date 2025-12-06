import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { Navigation } from './src/navigation';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { store } from './src/store';
import { Platform } from 'react-native';

// Importar estilos CSS para web
if (Platform.OS === 'web') {
  require('./web-styles.css');
}

export default function App() {
  useEffect(() => {
    // Adiciona estilos inline para web
    if (Platform.OS === 'web') {
      const style = document.createElement('style');
      style.textContent = `
        input:focus, textarea:focus {
          outline: none !important;
        }
        input[type="text"]:focus,
        input[type="email"]:focus,
        input[type="password"]:focus,
        input[type="tel"]:focus,
        input[type="number"]:focus {
          border-color: #1a73e8 !important;
        }
      `;
      document.head.appendChild(style);
    }
  }, []);

  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <Navigation />
      </SafeAreaProvider>
    </Provider>
  );
}
