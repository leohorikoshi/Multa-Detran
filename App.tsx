import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { Navigation } from './src/navigation';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { store } from './src/store';
import { Platform, Linking } from 'react-native';
import { ThemeProvider } from './src/contexts/ThemeContext';
import * as Notifications from 'expo-notifications';

// Configurar comportamento padrão de notificações
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

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

    // Configurar deep linking
    const handleDeepLink = (event: { url: string }) => {
      const url = event.url;
      console.log('Deep link recebido:', url);
      
      // Parsear URL: detrandenuncia://violation/123 ou https://detrandenuncia.com.br/violation/123
      const violationMatch = url.match(/violation\/([^/?]+)/);
      if (violationMatch && violationMatch[1]) {
        const violationId = violationMatch[1];
        console.log('Abrindo denúncia:', violationId);
        // TODO: Navegar para ViolationDetailsScreen com violationId
        // navigation.navigate('ViolationDetails', { violationId });
      }
    };

    // Listener para deep links (quando app já está aberto)
    const subscription = Linking.addEventListener('url', handleDeepLink);

    // Verificar deep link inicial (quando app abre via deep link)
    Linking.getInitialURL().then((url) => {
      if (url) {
        handleDeepLink({ url });
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);

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
