import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
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

export const Navigation = () => {
  // Temporariamente desabilitado - causa erro na web
  // useInitializeAuth();
  
  const { token, isLoading, user } = useAppSelector((state) => state.auth);
  
  useEffect(() => {
    console.log('🔄 Navigation atualizada!');
    console.log('🔍 Token:', token ? 'Presente' : 'Ausente');
    console.log('🚪 Mostrando telas:', token ? 'AUTENTICADAS' : 'NÃO AUTENTICADAS');
  }, [token, user, isLoading]);

  return (
    <NavigationContainer key={token ? 'authenticated' : 'unauthenticated'}>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#fff' },
        }}
      >
        {!token ? (
          // Telas não autenticadas
          <>
            <Stack.Screen name="Welcome" component={WelcomeScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </>
        ) : (
          // Telas autenticadas
          <>
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
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};