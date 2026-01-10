import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Platform } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { useTheme } from '../contexts/ThemeContext';
import { useResponsive } from '../hooks/useResponsive';

type WelcomeScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Welcome'>;
};

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ navigation }) => {
  const { colors } = useTheme();
  const { isDesktop, isMobile } = useResponsive();
  const [hoveredButton, setHoveredButton] = useState<'login' | 'register' | null>(null);
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.primary }]}>Denúncia de Infrações de Trânsito</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Contribua para um trânsito mais seguro</Text>
        
        <View style={[styles.testInfo, { backgroundColor: colors.warning + '20', borderColor: colors.warning }]}>
          <Text style={[styles.testTitle, { color: colors.textSecondary }]}>🧪 MODO DE TESTE</Text>
          <Text style={[styles.testText, { color: colors.textSecondary }]}>📧 Email: teste@teste.com</Text>
          <Text style={[styles.testText, { color: colors.textSecondary }]}>🔑 Senha: 123456</Text>
        </View>
        
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[
              styles.button,
              { backgroundColor: hoveredButton === 'login' ? colors.primaryDark : colors.primary },
              styles.buttonShadow,
              hoveredButton === 'login' && styles.buttonHovered
            ]}
            onPress={() => navigation.navigate('Login')}
            onMouseEnter={() => Platform.OS === 'web' && setHoveredButton('login')}
            onMouseLeave={() => Platform.OS === 'web' && setHoveredButton(null)}
          >
            <Text style={[styles.buttonText, { color: '#FFFFFF', fontSize: isMobile ? 16 : 18 }]}>Entrar</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.button,
              styles.buttonOutline,
              { borderColor: colors.primary, backgroundColor: hoveredButton === 'register' ? colors.primary + '10' : 'transparent' },
              styles.buttonShadow,
              hoveredButton === 'register' && styles.buttonHovered
            ]}
            onPress={() => navigation.navigate('Register')}
            onMouseEnter={() => Platform.OS === 'web' && setHoveredButton('register')}
            onMouseLeave={() => Platform.OS === 'web' && setHoveredButton(null)}
          >
            <Text style={[styles.buttonText, styles.buttonOutlineText, { color: colors.primary, fontSize: isMobile ? 16 : 18 }]}>Criar Conta</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 12,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 17,
    textAlign: 'center',
    marginBottom: 40,
    fontWeight: '400',
  },
  buttonContainer: {
    width: '100%',
    maxWidth: 400,
    gap: 16,
  },
  button: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    ...Platform.select({
      web: {
        transition: 'all 0.3s ease',
        cursor: 'pointer',
      },
    }),
  },
  buttonShadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonHovered: {
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
    transform: [{ translateY: -2 }],
  },
  buttonOutline: {
    backgroundColor: 'transparent',
    borderWidth: 2,
  },
  buttonText: {
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  buttonOutlineText: {
  },
  testInfo: {
    borderWidth: 2,
    borderRadius: 12,
    padding: 20,
    marginBottom: 32,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  testTitle: {
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 10,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  testText: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 5,
    fontWeight: '500',
  },
});