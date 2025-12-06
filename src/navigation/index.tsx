import React, { useEffect } from 'react';
import { NavigationContainer, useNavigationContainerRef } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { useAppSelector } from '../hooks/useRedux';
// import { useInitializeAuth } from '../hooks/useInitializeAuth'; // DESABILITADO - causa erro na web

// Telas não autenticadas
import { WelcomeScreen } from '../screens/WelcomeScreen';
import { LoginScreen } from '../screens/LoginScreen';
import { RegisterScreen } from '../screens/RegisterScreen';

// Telas autenticadas
import { HomeScreen } from '../screens/HomeScreen';
import { ReportViolationScreen } from '../screens/ReportViolationScreen';
import { MyReportsScreen } from '../screens/MyReportsScreen';
import SettingsScreen from '../screens/SettingsScreen';
import AdminDashboard from '../screens/AdminDashboard';
import HeatmapScreen from '../screens/HeatmapScreen'; // React Native vai escolher .web.tsx na web automaticamente
import { Platform, View, Text, StyleSheet } from 'react-native';

const Stack = createNativeStackNavigator<RootStackParamList>();

const linking = {
  prefixes: ['http://localhost:8081', 'https://localhost:8081'],
  config: {
    screens: {
      Welcome: '',
      Login: 'login',
      Register: 'register',
      Home: 'home',
      ReportViolation: 'report',
      MyReports: 'my-reports',
      Settings: 'settings',
      HeatmapScreen: 'heatmap',
      AdminDashboard: 'dashboard',
    },
  },
};

export const Navigation = () => {
  const { token } = useAppSelector((state) => state.auth);
  const navigationRef = useNavigationContainerRef();
  
  console.log('🔄 Navigation - Token:', token ? 'Presente' : 'Ausente');

  // Redirecionar automaticamente quando o token mudar
  useEffect(() => {
    console.log('🔄 useEffect disparado - Token:', token ? 'Presente' : 'Ausente');
    
    if (!token) {
      console.log('⚠️ Sem token - Permanece na tela atual');
      return;
    }
    
    // Aguardar um pouco para garantir que o navigation está montado
    const timer = setTimeout(() => {
      if (navigationRef.current) {
        console.log('✅ Token presente - Navegando para Home');
        try {
          navigationRef.current.navigate('Home' as never);
        } catch (error) {
          console.error('❌ Erro ao navegar:', error);
        }
      } else {
        console.log('⚠️ navigationRef.current não existe ainda');
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [token]); // Depende apenas do token - navigationRef causa loop

  return (
    <NavigationContainer 
      ref={navigationRef}
      linking={linking}
      onStateChange={(state) => {
        console.log('📍 Navigation state:', state);
      }}
      onReady={() => console.log('🚀 NavigationContainer pronto!')}
    >
      <Stack.Navigator
        initialRouteName={token ? "Home" : "Welcome"}
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#fff' },
        }}
      >
        {/* Telas não autenticadas */}
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        
        {/* Telas autenticadas */}
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen
          name="ReportViolation"
          component={ReportViolationScreen}
          options={{
            headerShown: true,
            headerTitle: 'Nova Denúncia',
            headerTintColor: '#fff',
            headerStyle: {
              backgroundColor: '#1a73e8',
            },
          }}
        />
        <Stack.Screen
          name="MyReports"
          component={MyReportsScreen}
          options={{
            headerShown: true,
            headerTitle: 'Minhas Denúncias',
            headerTintColor: '#fff',
            headerStyle: {
              backgroundColor: '#1a73e8',
            },
          }}
        />
        <Stack.Screen
          name="Settings"
          component={SettingsScreen}
          options={{
            headerShown: true,
            headerTitle: 'Configurações',
            headerTintColor: '#fff',
            headerStyle: {
              backgroundColor: '#1a73e8',
            },
          }}
        />
        <Stack.Screen
          name="HeatmapScreen"
          component={HeatmapScreen}
          options={{
            headerShown: true,
            headerTitle: 'Mapa de Calor',
            headerTintColor: '#fff',
            headerStyle: {
              backgroundColor: '#1a73e8',
            },
          }}
        />
        <Stack.Screen
          name="AdminDashboard"
          component={AdminDashboard}
          options={{
            headerShown: true,
            headerTitle: 'Gamificação',
            headerTintColor: '#fff',
            headerStyle: {
              backgroundColor: '#1a73e8',
            },
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};