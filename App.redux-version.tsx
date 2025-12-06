import React from 'react';
import { Provider } from 'react-redux';
import { Navigation } from './src/navigation';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { store } from './src/store';
import { ThemeProvider } from './src/contexts/ThemeContext';

export default function App() {
  console.log('🚀 App DetranDenuncia v2.0.0 iniciando...');
  
  return (
    <Provider store={store}>
      <ThemeProvider>
        <SafeAreaProvider>
          <Navigation />
        </SafeAreaProvider>
      </ThemeProvider>
    </Provider>
  );
}
