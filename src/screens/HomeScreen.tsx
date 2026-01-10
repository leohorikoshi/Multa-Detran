import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { useAppDispatch, useAppSelector } from '../hooks/useRedux';
import { useResponsive } from '../hooks/useResponsive';
import { logout } from '../store/slices/authSlice';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { useTheme } from '../contexts/ThemeContext';
import { GovBrHeader } from '../components/ui/GovBrHeader';

type HomeScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Home'>;
};

export const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const { colors } = useTheme();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const { isMobile, isDesktop, width } = useResponsive();
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  
  // Calcular número de colunas no grid baseado no tamanho da tela
  const gridColumns = isDesktop ? 4 : isMobile ? 2 : 3;
  const cardWidth = isDesktop ? '23%' : isMobile ? '47%' : '31%';

  const handleLogout = () => {
    console.log('🚪 Logout chamado');
    dispatch(logout());
    navigation.navigate('Welcome' as never);
  };

  const handleNewReport = () => {
    console.log('📝 Navegando para Nova Denúncia');
    navigation.navigate('ReportViolation' as never);
  };

  const handleMyReports = () => {
    console.log('📋 Navegando para Minhas Denúncias');
    navigation.navigate('MyReports' as never);
  };

  const handleSettings = () => {
    console.log('⚙️ Navegando para Configurações');
    navigation.navigate('Settings' as never);
  };

  const handleGamification = () => {
    console.log('🎮 Navegando para Admin Dashboard');
    navigation.navigate('AdminDashboard' as never);
  };

  const handleAdminUsers = () => {
    console.log('👥 Navegando para Admin Users');
    navigation.navigate('AdminUsers' as never);
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
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <GovBrHeader title="DetranDenuncia" />
      <ScrollView contentContainerStyle={isDesktop && styles.desktopContainer}>
        <View style={[styles.welcomeSection, { backgroundColor: colors.backgroundSecondary }]}>
          <Text style={[styles.welcomeText, { color: colors.text }, isDesktop && styles.welcomeTextDesktop]}>
            Olá, {user?.name}
          </Text>
          <Text style={[styles.welcomeSubtext, { color: colors.textSecondary }]}>
            Contribua para um trânsito mais seguro
          </Text>
        </View>

        <View style={[styles.content, isDesktop && styles.contentDesktop]}>
          {/* Botão principal */}
          <TouchableOpacity 
            style={[
              styles.mainButton,
              { backgroundColor: hoveredCard === 'main' ? colors.primaryDark : colors.primary },
              isDesktop && styles.mainButtonDesktop,
              hoveredCard === 'main' && styles.cardHovered
            ]} 
          onPress={handleNewReport}
          onMouseEnter={() => Platform.OS === 'web' && setHoveredCard('main')}
          onMouseLeave={() => Platform.OS === 'web' && setHoveredCard(null)}
        >
          <Text style={styles.mainButtonIcon}>📝</Text>
          <Text style={[styles.mainButtonText, { color: '#FFFFFF' }, isDesktop && styles.mainButtonTextDesktop]}>
            Nova Denúncia
          </Text>
          <Text style={[styles.buttonDescription, { color: 'rgba(255,255,255,0.9)' }]}>
            Registrar uma nova infração de trânsito
          </Text>
        </TouchableOpacity>

        {/* Grid de funcionalidades */}
        <View style={[styles.featuresGrid, isDesktop && styles.featuresGridDesktop]}>
          <TouchableOpacity 
            style={[
              styles.featureCard,
              { width: cardWidth, backgroundColor: colors.surface },
              hoveredCard === 'myReports' && styles.cardHovered
            ]} 
            onPress={handleMyReports}
            onMouseEnter={() => Platform.OS === 'web' && setHoveredCard('myReports')}
            onMouseLeave={() => Platform.OS === 'web' && setHoveredCard(null)}
          >
            <Text style={styles.featureIcon}>📋</Text>
            <Text style={[styles.featureTitle, { color: colors.text }]}>Minhas Denúncias</Text>
            <Text style={[styles.featureDescription, { color: colors.textSecondary }]}>Acompanhar status</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[
              styles.featureCard,
              { width: cardWidth, backgroundColor: colors.surface },
              hoveredCard === 'heatmap' && styles.cardHovered
            ]} 
            onPress={() => alert('🗺️ Mapa de Calor em breve!')}
            onMouseEnter={() => Platform.OS === 'web' && setHoveredCard('heatmap')}
            onMouseLeave={() => Platform.OS === 'web' && setHoveredCard(null)}
          >
            <Text style={styles.featureIcon}>🗺️</Text>
            <Text style={[styles.featureTitle, { color: colors.text }]}>Mapa de Calor</Text>
            <Text style={[styles.featureDescription, { color: colors.textSecondary }]}>Ver regiões críticas</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[
              styles.featureCard,
              { width: cardWidth, backgroundColor: colors.surface },
              hoveredCard === 'gamification' && styles.cardHovered
            ]} 
            onPress={handleGamification}
            onMouseEnter={() => Platform.OS === 'web' && setHoveredCard('gamification')}
            onMouseLeave={() => Platform.OS === 'web' && setHoveredCard(null)}
          >
            <Text style={styles.featureIcon}>🏆</Text>
            <Text style={[styles.featureTitle, { color: colors.text }]}>Gamificação</Text>
            <Text style={[styles.featureDescription, { color: colors.textSecondary }]}>Ranking e conquistas</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[
              styles.featureCard,
              { width: cardWidth, backgroundColor: colors.surface },
              hoveredCard === 'adminUsers' && styles.cardHovered
            ]} 
            onPress={handleAdminUsers}
            onMouseEnter={() => Platform.OS === 'web' && setHoveredCard('adminUsers')}
            onMouseLeave={() => Platform.OS === 'web' && setHoveredCard(null)}
          >
            <Text style={styles.featureIcon}>👥</Text>
            <Text style={[styles.featureTitle, { color: colors.text }]}>Usuários</Text>
            <Text style={[styles.featureDescription, { color: colors.textSecondary }]}>Gerenciar cadastros</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[
              styles.featureCard,
              { width: cardWidth, backgroundColor: colors.surface },
              hoveredCard === 'darkmode' && styles.cardHovered
            ]} 
            onPress={handleSettings}
            onMouseEnter={() => Platform.OS === 'web' && setHoveredCard('darkmode')}
            onMouseLeave={() => Platform.OS === 'web' && setHoveredCard(null)}
          >
            <Text style={styles.featureIcon}>🌙</Text>
            <Text style={[styles.featureTitle, { color: colors.text }]}>Dark Mode</Text>
            <Text style={[styles.featureDescription, { color: colors.textSecondary }]}>Tema escuro</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[
              styles.featureCard,
              { width: cardWidth, backgroundColor: colors.surface },
              hoveredCard === 'chatbot' && styles.cardHovered
            ]} 
            onPress={handleChatbot}
            onMouseEnter={() => Platform.OS === 'web' && setHoveredCard('chatbot')}
            onMouseLeave={() => Platform.OS === 'web' && setHoveredCard(null)}
          >
            <Text style={styles.featureIcon}>🤖</Text>
            <Text style={[styles.featureTitle, { color: colors.text }]}>Chatbot</Text>
            <Text style={[styles.featureDescription, { color: colors.textSecondary }]}>Assistente virtual</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[
              styles.featureCard,
              { width: cardWidth, backgroundColor: colors.surface },
              hoveredCard === 'ocr' && styles.cardHovered
            ]} 
            onPress={handleOCR}
            onMouseEnter={() => Platform.OS === 'web' && setHoveredCard('ocr')}
            onMouseLeave={() => Platform.OS === 'web' && setHoveredCard(null)}
          >
            <Text style={styles.featureIcon}>📷</Text>
            <Text style={[styles.featureTitle, { color: colors.text }]}>OCR</Text>
            <Text style={[styles.featureDescription, { color: colors.textSecondary }]}>Ler placas</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[
              styles.featureCard,
              { width: cardWidth, backgroundColor: colors.surface },
              hoveredCard === 'pwa' && styles.cardHovered
            ]} 
            onPress={handlePWA}
            onMouseEnter={() => Platform.OS === 'web' && setHoveredCard('pwa')}
            onMouseLeave={() => Platform.OS === 'web' && setHoveredCard(null)}
          >
            <Text style={styles.featureIcon}>📱</Text>
            <Text style={[styles.featureTitle, { color: colors.text }]}>PWA</Text>
            <Text style={[styles.featureDescription, { color: colors.textSecondary }]}>Instalar no celular</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[
              styles.featureCard,
              { width: cardWidth, backgroundColor: colors.surface },
              hoveredCard === 'push' && styles.cardHovered
            ]} 
            onPress={handlePushNotifications}
            onMouseEnter={() => Platform.OS === 'web' && setHoveredCard('push')}
            onMouseLeave={() => Platform.OS === 'web' && setHoveredCard(null)}
          >
            <Text style={styles.featureIcon}>🔔</Text>
            <Text style={[styles.featureTitle, { color: colors.text }]}>Push Notifications</Text>
            <Text style={[styles.featureDescription, { color: colors.textSecondary }]}>Alertas em tempo real</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[
              styles.featureCard,
              { width: cardWidth, backgroundColor: colors.surface },
              hoveredCard === 'social' && styles.cardHovered
            ]} 
            onPress={handleSocialShare}
            onMouseEnter={() => Platform.OS === 'web' && setHoveredCard('social')}
            onMouseLeave={() => Platform.OS === 'web' && setHoveredCard(null)}
          >
            <Text style={styles.featureIcon}>📤</Text>
            <Text style={[styles.featureTitle, { color: colors.text }]}>Compartilhar</Text>
            <Text style={[styles.featureDescription, { color: colors.textSecondary }]}>Redes sociais</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[
              styles.featureCard,
              { width: cardWidth, backgroundColor: colors.surface },
              hoveredCard === 'offline' && styles.cardHovered
            ]} 
            onPress={handleOfflineMode}
            onMouseEnter={() => Platform.OS === 'web' && setHoveredCard('offline')}
            onMouseLeave={() => Platform.OS === 'web' && setHoveredCard(null)}
          >
            <Text style={styles.featureIcon}>✈️</Text>
            <Text style={[styles.featureTitle, { color: colors.text }]}>Modo Offline</Text>
            <Text style={[styles.featureDescription, { color: colors.textSecondary }]}>Usar sem internet</Text>
          </TouchableOpacity>
        </View>

        {/* Botões de ação no rodapé */}
        <View style={styles.footerActions}>
          <TouchableOpacity 
            onPress={handleSettings} 
            style={[styles.footerButton, { backgroundColor: colors.surface, borderColor: colors.border }]}
          >
            <Text style={[styles.footerButtonText, { color: colors.text }]}>⚙️ Configurações</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={handleLogout} 
            style={[styles.footerButton, { backgroundColor: colors.error }]}
          >
            <Text style={[styles.footerButtonText, { color: '#FFFFFF' }]}>🚪 Sair</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={[styles.infoSection, { backgroundColor: colors.surface, borderLeftColor: colors.primary }, isDesktop && styles.infoSectionDesktop]}>
        <Text style={[styles.infoTitle, { color: colors.text }]}>🎨 Design Profissional Detran-SP</Text>
        <Text style={[styles.infoText, { color: colors.textSecondary }]}>
          • Cores corporativas azul royal • Cards com sombras suaves
        </Text>
        <Text style={[styles.infoText, { color: colors.textSecondary }]}>
          • Layout clean e moderno • Tipografia profissional
        </Text>
        <Text style={[styles.infoText, { color: colors.textSecondary }]}>
          • Dark Mode • Gamificação • Mapa de Calor • PWA
        </Text>
      </View>
    </ScrollView>
  </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  desktopContainer: {
    alignItems: 'center',
  },
  welcomeSection: {
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#E8E8E8',
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  welcomeSubtext: {
    fontSize: 14,
  },
  welcomeTextDesktop: {
    fontSize: 28,
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
    padding: 24,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 24,
    ...Platform.select({
      web: {
        transition: 'all 0.2s ease-in-out',
        cursor: 'pointer',
        boxShadow: '0 4px 12px rgba(21, 101, 192, 0.2)',
      },
      default: {
        shadowColor: '#1565C0',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 12,
        elevation: 4,
      },
    }),
  },
  mainButtonDesktop: {
    padding: 32,
    borderRadius: 12,
  },
  mainButtonIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  mainButtonText: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
  },
  mainButtonTextDesktop: {
    fontSize: 24,
  },
  buttonDescription: {
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
    padding: 20,
    borderRadius: 8,
    alignItems: 'center',
    minHeight: 140,
    justifyContent: 'center',
    ...Platform.select({
      web: {
        transition: 'all 0.2s ease-in-out',
        cursor: 'pointer',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
      },
      default: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 2,
      },
    }),
  },
  cardHovered: {
    ...Platform.select({
      web: {
        boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
      },
      default: {
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.12,
        shadowRadius: 12,
        elevation: 6,
      },
    }),
    transform: [{ scale: 1.02 }, { translateY: -2 }],
  },
  featureIcon: {
    fontSize: 40,
    marginBottom: 8,
  },
  featureTitle: {
    fontSize: 15,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 4,
    letterSpacing: 0.3,
  },
  featureDescription: {
    fontSize: 12,
    textAlign: 'center',
    fontWeight: '500',
  },
  footerActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
    paddingBottom: 20,
  },
  footerButton: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 100,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 2,
  },
  secondaryButtonText: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
  },
  infoSection: {
    margin: 20,
    padding: 20,
    borderRadius: 8,
    borderLeftWidth: 3,
    ...Platform.select({
      web: {
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
      },
      default: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 2,
      },
    }),
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
  },
  infoText: {
    fontSize: 13,
    marginBottom: 8,
    lineHeight: 20,
  },
});