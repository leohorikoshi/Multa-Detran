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
    },
  },
};

export const Navigation = () => {
  const { token } = useAppSelector((state) => state.auth);
  const navigationRef = useNavigationContainerRef();
  
  console.log('🔄 Navigation - Token:', token ? 'Presente' : 'Ausente');

  // Redirecionar automaticamente quando o token mudar
  useEffect(() => {
    if (navigationRef.isReady()) {
      if (token) {
        console.log('✅ Token presente - Navegando para Home');
        navigationRef.navigate('Home' as never);
      } else {
        console.log('❌ Token ausente - Navegando para Welcome');
        navigationRef.navigate('Welcome' as never);
      }
    }
  }, [token, navigationRef]);

  return (
    <NavigationContainer 
      ref={navigationRef}
      linking={linking}
      onStateChange={(state) => {
        console.log('📍 Navigation state:', state);
      }}
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
      </Stack.Navigator>
    </NavigationContainer>
  );
};