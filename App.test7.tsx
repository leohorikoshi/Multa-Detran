import React from 'react';
import { Provider } from 'react-redux';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { store } from './src/store';
import { Navigation } from './src/navigation';

// TESTE 7: Com componente Navigation completo (já modificado sem useInitializeAuth)
export default function App() {
  console.log('🧪 TESTE 7: Com Navigation completo');
  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <Navigation />
      </SafeAreaProvider>
    </Provider>
  );
}
