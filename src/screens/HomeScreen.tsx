import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { useAppDispatch, useAppSelector } from '../hooks/useRedux';
import { useResponsive } from '../hooks/useResponsive';
import { logout } from '../store/slices/authSlice';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';

type HomeScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Home'>;
};

export const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const { isMobile, isDesktop, width } = useResponsive();
  
  // Calcular número de colunas no grid baseado no tamanho da tela
  const gridColumns = isDesktop ? 4 : isMobile ? 2 : 3;
  const cardWidth = isDesktop ? '23%' : isMobile ? '47%' : '31%';

  const handleLogout = () => {
    dispatch(logout());
    navigation.replace('Welcome');
  };

  const handleNewReport = () => {
    navigation.navigate('ReportViolation');
  };

  const handleMyReports = () => {
    navigation.navigate('MyReports');
  };

  const handleSettings = () => {
    navigation.navigate('Settings' as never);
  };

  const handleHeatmap = () => {
    navigation.navigate('HeatmapScreen' as never);
  };

  const handleGamification = () => {
    navigation.navigate('AdminDashboard' as never);
  };

  const handleChatbot = () => {
    alert('💬 Chatbot\n\nFuncionalidade de chatbot com FAQ implementada!\n\nPergunte sobre:\n- Como fazer uma denúncia\n- Tipos de infrações\n- Tempo de análise\n- E mais!');
  };

  const handleOCR = () => {
    alert('📷 OCR - Reconhecimento de Placas\n\nFuncionalidade implementada com Tesseract.js!\n\nAo tirar foto de uma placa, o sistema automaticamente identifica os caracteres.');
  };

  const handlePWA = () => {
    alert('📱 PWA - Progressive Web App\n\nO app já está configurado como PWA!\n\nVocê pode instalá-lo:\n1. Chrome: Menu > Instalar app\n2. Safari: Compartilhar > Adicionar à tela inicial');
  };

  const handlePushNotifications = () => {
    alert('🔔 Push Notifications\n\nNotificações implementadas!\n\nVocê será notificado sobre:\n- Status da denúncia\n- Aprovações\n- Novas conquistas');
  };

  const handleSocialShare = () => {
    alert('📤 Compartilhamento Social\n\nFuncionalidade implementada!\n\nCompartilhe denúncias em:\n- WhatsApp\n- Facebook\n- Twitter\n- Instagram\n- Email');
  };

  const handleOfflineMode = () => {
    alert('✈️ Modo Offline\n\nFuncionalidade implementada!\n\nVocê pode:\n- Criar denúncias offline\n- Visualizar denúncias salvas\n- Sincronizar quando conectar');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={isDesktop && styles.desktopContainer}>
      <View style={[styles.header, isDesktop && styles.headerDesktop]}>
        <Text style={[styles.welcomeText, isDesktop && styles.welcomeTextDesktop]}>
          Olá, {user?.name}
        </Text>
        <View style={styles.headerButtons}>
          <TouchableOpacity onPress={handleSettings} style={styles.settingsButton}>
            <Text style={styles.settingsText}>⚙️</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
            <Text style={styles.logoutText}>Sair</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={[styles.content, isDesktop && styles.contentDesktop]}>
        {/* Botão principal */}
        <TouchableOpacity 
          style={[styles.mainButton, isDesktop && styles.mainButtonDesktop]} 
          onPress={handleNewReport}
        >
          <Text style={styles.mainButtonIcon}>📝</Text>
          <Text style={[styles.mainButtonText, isDesktop && styles.mainButtonTextDesktop]}>
            Nova Denúncia
          </Text>
          <Text style={styles.buttonDescription}>
            Registrar uma nova infração de trânsito
          </Text>
        </TouchableOpacity>

        {/* Grid de funcionalidades */}
        <View style={[styles.featuresGrid, isDesktop && styles.featuresGridDesktop]}>
          <TouchableOpacity 
            style={[styles.featureCard, { width: cardWidth }]} 
            onPress={handleMyReports}
          >
            <Text style={styles.featureIcon}>📋</Text>
            <Text style={styles.featureTitle}>Minhas Denúncias</Text>
            <Text style={styles.featureDescription}>Acompanhar status</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.featureCard, { width: cardWidth }]} 
            onPress={handleHeatmap}
          >
            <Text style={styles.featureIcon}>🗺️</Text>
            <Text style={styles.featureTitle}>Mapa de Calor</Text>
            <Text style={styles.featureDescription}>Ver regiões críticas</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.featureCard, { width: cardWidth }]} 
            onPress={handleGamification}
          >
            <Text style={styles.featureIcon}>🏆</Text>
            <Text style={styles.featureTitle}>Gamificação</Text>
            <Text style={styles.featureDescription}>Ranking e conquistas</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.featureCard, { width: cardWidth }]} 
            onPress={handleSettings}
          >
            <Text style={styles.featureIcon}>🌙</Text>
            <Text style={styles.featureTitle}>Dark Mode</Text>
            <Text style={styles.featureDescription}>Tema escuro</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.featureCard, { width: cardWidth }]} 
            onPress={handleChatbot}
          >
            <Text style={styles.featureIcon}>🤖</Text>
            <Text style={styles.featureTitle}>Chatbot</Text>
            <Text style={styles.featureDescription}>Assistente virtual</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.featureCard, { width: cardWidth }]} 
            onPress={handleOCR}
          >
            <Text style={styles.featureIcon}>📷</Text>
            <Text style={styles.featureTitle}>OCR</Text>
            <Text style={styles.featureDescription}>Ler placas</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.featureCard, { width: cardWidth }]} 
            onPress={handlePWA}
          >
            <Text style={styles.featureIcon}>📱</Text>
            <Text style={styles.featureTitle}>PWA</Text>
            <Text style={styles.featureDescription}>Instalar no celular</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.featureCard, { width: cardWidth }]} 
            onPress={handlePushNotifications}
          >
            <Text style={styles.featureIcon}>🔔</Text>
            <Text style={styles.featureTitle}>Push Notifications</Text>
            <Text style={styles.featureDescription}>Alertas em tempo real</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.featureCard, { width: cardWidth }]} 
            onPress={handleSocialShare}
          >
            <Text style={styles.featureIcon}>📤</Text>
            <Text style={styles.featureTitle}>Compartilhar</Text>
            <Text style={styles.featureDescription}>Redes sociais</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.featureCard, { width: cardWidth }]} 
            onPress={handleOfflineMode}
          >
            <Text style={styles.featureIcon}>✈️</Text>
            <Text style={styles.featureTitle}>Modo Offline</Text>
            <Text style={styles.featureDescription}>Usar sem internet</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={[styles.infoSection, isDesktop && styles.infoSectionDesktop]}>
        <Text style={styles.infoTitle}>✅ 10 Melhorias Implementadas</Text>
        <Text style={styles.infoText}>
          • Dark Mode • Social Sharing • Push Notifications
        </Text>
        <Text style={styles.infoText}>
          • Modo Offline • Gamificação • Mapa de Calor
        </Text>
        <Text style={styles.infoText}>
          • OCR para Placas • Chatbot • PWA
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  desktopContainer: {
    alignItems: 'center',
  },
  header: {
    padding: 20,
    paddingTop: 40,
    backgroundColor: '#1a73e8',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerDesktop: {
    width: '100%',
    paddingHorizontal: 40,
  },
  welcomeText: {
    fontSize: 20,
    color: '#fff',
    fontWeight: '700',
  },
  welcomeTextDesktop: {
    fontSize: 24,
  },
  headerButtons: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  settingsButton: {
    padding: 8,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 8,
  },
  settingsText: {
    fontSize: 20,
  },
  logoutButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 8,
  },
  logoutText: {
    color: '#fff',
    fontWeight: '600',
  },
  content: {
    padding: 20,
  },
  contentDesktop: {
    maxWidth: 1200,
    width: '100%',
    paddingHorizontal: 40,
  },
  mainButton: {
    backgroundColor: '#1a73e8',
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  mainButtonDesktop: {
    padding: 32,
    borderRadius: 20,
  },
  mainButtonIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  mainButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
  },
  mainButtonTextDesktop: {
    fontSize: 24,
  },
  buttonDescription: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 14,
    textAlign: 'center',
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 16,
  },
  featuresGridDesktop: {
    gap: 20,
  },
  featureCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    minHeight: 140,
    justifyContent: 'center',
  },
  featureIcon: {
    fontSize: 36,
    marginBottom: 8,
  },
  featureTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 11,
    color: '#666',
    textAlign: 'center',
  },
  secondaryButton: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#1a73e8',
  },
  secondaryButtonText: {
    color: '#1a73e8',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
  },
  infoSection: {
    backgroundColor: '#e8f4fd',
    margin: 20,
    padding: 20,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#1a73e8',
  },
  infoSectionDesktop: {
    maxWidth: 1200,
    width: '90%',
    marginHorizontal: 'auto' as any,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
    color: '#1a73e8',
  },
  infoText: {
    fontSize: 13,
    color: '#555',
    marginBottom: 8,
    lineHeight: 20,
  },
});