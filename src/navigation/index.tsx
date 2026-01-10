import React, { useEffect } from 'react';
import { NavigationContainer, useNavigationContainerRef } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { useAppSelector } from '../hooks/useRedux';

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
import HeatmapScreen from '../screens/HeatmapScreen';
import AdminUsersScreen from '../screens/AdminUsersScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const Navigation = () => {
  const { token } = useAppSelector((state) => state.auth);
  
  console.log('🔄 Navigation - Token:', token ? 'Presente' : 'Ausente');

  return (
    <NavigationContainer
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
        <Stack.Screen
          name="AdminUsers"
          component={AdminUsersScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};