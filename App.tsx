import React, { useState } from 'react';
import { Provider } from 'react-redux';
import { View, SafeAreaView, StyleSheet } from 'react-native';
import { store } from './src/store';
import { ThemeProvider, useTheme } from './src/contexts/ThemeContext';
import { WelcomeScreen } from './src/screens/WelcomeScreen';
import { LoginScreen } from './src/screens/LoginScreen';
import { RegisterScreen } from './src/screens/RegisterScreen';
import { ForgotPasswordScreen } from './src/screens/ForgotPasswordScreen';
import { HomeScreen } from './src/screens/HomeScreen';
import { ReportViolationScreen } from './src/screens/ReportViolationScreen';
import { MyReportsScreen } from './src/screens/MyReportsScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import AdminDashboard from './src/screens/AdminDashboard';
import AdminUsersScreen from './src/screens/AdminUsersScreen';

type Screen = 'Welcome' | 'Login' | 'Register' | 'ForgotPassword' | 'Home' | 'ReportViolation' | 'MyReports' | 'Settings' | 'AdminDashboard' | 'AdminUsers';

function AppNavigator() {
  const { colors } = useTheme();
  const [currentScreen, setCurrentScreen] = useState<Screen>('Welcome');
  const [screenHistory, setScreenHistory] = useState<Screen[]>(['Welcome']);
  
  console.log('📱 Tela atual:', currentScreen);
  console.log('📚 Histórico:', screenHistory);
  
  const navigate = (screen: Screen) => {
    console.log('🔄 Navegando para:', screen);
    setScreenHistory(prev => [...prev, screen]);
    setCurrentScreen(screen);
  };
  
  const replace = (screen: Screen) => {
    console.log('🔄 Substituindo tela para:', screen);
    setCurrentScreen(screen);
  };
  
  const goBack = () => {
    console.log('⬅️ Voltando...');
    if (screenHistory.length > 1) {
      const newHistory = [...screenHistory];
      newHistory.pop(); // Remove tela atual
      const previousScreen = newHistory[newHistory.length - 1];
      setScreenHistory(newHistory);
      setCurrentScreen(previousScreen);
      console.log('⬅️ Voltou para:', previousScreen);
    } else {
      console.log('⬅️ Não há telas no histórico');
    }
  };
  
  const navigation: any = { navigate, replace, goBack };
  
  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <View key={colors.background} style={[styles.screenContainer, { backgroundColor: colors.background }]}>
        {currentScreen === 'Welcome' && <WelcomeScreen navigation={navigation} />}
        {currentScreen === 'Login' && <LoginScreen navigation={navigation} />}
        {currentScreen === 'Register' && <RegisterScreen navigation={navigation} />}
        {currentScreen === 'ForgotPassword' && <ForgotPasswordScreen navigation={navigation} />}
        {currentScreen === 'Home' && <HomeScreen navigation={navigation} />}
        {currentScreen === 'ReportViolation' && <ReportViolationScreen navigation={navigation} />}
        {currentScreen === 'MyReports' && <MyReportsScreen navigation={navigation} />}
        {currentScreen === 'Settings' && <SettingsScreen navigation={navigation} />}
        {currentScreen === 'AdminDashboard' && <AdminDashboard navigation={navigation} />}
        {currentScreen === 'AdminUsers' && <AdminUsersScreen navigation={navigation} />}
      </View>
    </SafeAreaView>
  );
}

export default function App() {
  console.log('🚀 DetranDenuncia App iniciado');
  
  return (
    <Provider store={store}>
      <ThemeProvider>
        <AppNavigator />
      </ThemeProvider>
    </Provider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  screenContainer: {
    flex: 1,
  },
});

