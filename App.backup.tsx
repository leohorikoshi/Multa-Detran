import React, { useEffect, Component, ErrorInfo, ReactNode } from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { Navigation } from './src/navigation';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { store, persistor } from './src/store';
import { Platform, Linking, ActivityIndicator, View, Text } from 'react-native';
import { ThemeProvider } from './src/contexts/ThemeContext';
import * as Notifications from 'expo-notifications';

// Error Boundary
class ErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error Boundary caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, backgroundColor: '#fff' }}>
          <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#d32f2f', marginBottom: 10 }}>
            ❌ Erro na aplicação
          </Text>
          <Text style={{ fontSize: 14, color: '#666', textAlign: 'center' }}>
            {this.state.error?.message || 'Erro desconhecido'}
          </Text>
          <Text style={{ fontSize: 12, color: '#999', marginTop: 10 }}>
            Verifique o console para mais detalhes
          </Text>
        </View>
      );
    }

    return this.props.children;
  }
}

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
    <ErrorBoundary>
      <Provider store={store}>
        <PersistGate 
          loading={
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
              <ActivityIndicator size="large" color="#1E88E5" />
              <Text style={{ marginTop: 10, color: '#666' }}>Carregando...</Text>
            </View>
          } 
          persistor={persistor}
        >
          <ThemeProvider>
            <SafeAreaProvider>
              <Navigation />
            </SafeAreaProvider>
          </ThemeProvider>
        </PersistGate>
      </Provider>
    </ErrorBoundary>
  );
}
