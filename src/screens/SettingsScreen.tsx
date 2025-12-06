/**
 * Settings Screen - Configurações do App
 * Inclui: Theme Selector, Notificações, Perfil, Sobre
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
} from 'react-native';
import { useTheme } from '../contexts/ThemeContext';

const SettingsScreen: React.FC = () => {
  const { theme, themeMode, colors, setThemeMode } = useTheme();

  const getThemeLabel = (mode: string) => {
    switch (mode) {
      case 'light':
        return 'Claro';
      case 'dark':
        return 'Escuro';
      case 'auto':
        return 'Automático';
      default:
        return 'Automático';
    }
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Configurações</Text>
      </View>

      {/* Seção: Aparência */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>APARÊNCIA</Text>

        {/* Tema */}
        <View style={[styles.card, { backgroundColor: colors.surface }]}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>Tema</Text>
          <Text style={[styles.cardSubtitle, { color: colors.textSecondary }]}>
            Escolha entre claro, escuro ou automático (segue o sistema)
          </Text>

          <View style={styles.themeOptions}>
            {/* Light */}
            <TouchableOpacity
              style={[
                styles.themeButton,
                { borderColor: colors.border },
                themeMode === 'light' && { 
                  borderColor: colors.primary, 
                  backgroundColor: colors.primaryLight + '20' 
                },
              ]}
              onPress={() => setThemeMode('light')}
            >
              <View style={[styles.themePreview, { backgroundColor: '#FFFFFF' }]}>
                <View style={styles.themePreviewBar} />
              </View>
              <Text
                style={[
                  styles.themeButtonText,
                  { color: colors.text },
                  themeMode === 'light' && { color: colors.primary, fontWeight: '600' },
                ]}
              >
                ☀️ Claro
              </Text>
            </TouchableOpacity>

            {/* Dark */}
            <TouchableOpacity
              style={[
                styles.themeButton,
                { borderColor: colors.border },
                themeMode === 'dark' && { 
                  borderColor: colors.primary, 
                  backgroundColor: colors.primaryLight + '20' 
                },
              ]}
              onPress={() => setThemeMode('dark')}
            >
              <View style={[styles.themePreview, { backgroundColor: '#121212' }]}>
                <View style={[styles.themePreviewBar, { backgroundColor: '#42A5F5' }]} />
              </View>
              <Text
                style={[
                  styles.themeButtonText,
                  { color: colors.text },
                  themeMode === 'dark' && { color: colors.primary, fontWeight: '600' },
                ]}
              >
                🌙 Escuro
              </Text>
            </TouchableOpacity>

            {/* Auto */}
            <TouchableOpacity
              style={[
                styles.themeButton,
                { borderColor: colors.border },
                themeMode === 'auto' && { 
                  borderColor: colors.primary, 
                  backgroundColor: colors.primaryLight + '20' 
                },
              ]}
              onPress={() => setThemeMode('auto')}
            >
              <View style={[styles.themePreview, { backgroundColor: colors.backgroundSecondary }]}>
                <View style={[styles.themePreviewBar, { backgroundColor: colors.primary }]} />
              </View>
              <Text
                style={[
                  styles.themeButtonText,
                  { color: colors.text },
                  themeMode === 'auto' && { color: colors.primary, fontWeight: '600' },
                ]}
              >
                🔄 Automático
              </Text>
            </TouchableOpacity>
          </View>

          <View style={[styles.infoBox, { backgroundColor: colors.backgroundSecondary }]}>
            <Text style={[styles.infoText, { color: colors.textSecondary }]}>
              💡 <Text style={{ fontWeight: '600' }}>Tema atual:</Text> {getThemeLabel(themeMode)}
              {themeMode === 'auto' && ` (Sistema: ${theme === 'dark' ? 'Escuro' : 'Claro'})`}
            </Text>
          </View>
        </View>
      </View>

      {/* Seção: Notificações (Futuro) */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>NOTIFICAÇÕES</Text>

        <View style={[styles.card, { backgroundColor: colors.surface }]}>
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={[styles.cardTitle, { color: colors.text }]}>Push Notifications</Text>
              <Text style={[styles.cardSubtitle, { color: colors.textSecondary }]}>
                Em breve: Receba atualizações de suas denúncias
              </Text>
            </View>
            <Switch
              value={false}
              disabled
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={colors.surface}
            />
          </View>
        </View>
      </View>

      {/* Seção: Sobre */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>SOBRE</Text>

        <View style={[styles.card, { backgroundColor: colors.surface }]}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>DetranDenuncia</Text>
          <Text style={[styles.cardSubtitle, { color: colors.textSecondary }]}>
            Versão 1.2.0 (Beta)
          </Text>
          <Text style={[styles.aboutText, { color: colors.textSecondary }]}>
            {'\n'}Sistema de denúncias de infrações de trânsito com validação anti-IA.
            {'\n\n'}Desenvolvido com ❤️ para tornar o trânsito mais seguro.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  section: {
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 1,
    marginBottom: 12,
  },
  card: {
    borderRadius: 12,
    padding: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 14,
    lineHeight: 20,
  },
  themeOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    gap: 12,
  },
  themeButton: {
    flex: 1,
    borderWidth: 2,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
  },
  themePreview: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginBottom: 8,
    justifyContent: 'flex-start',
    padding: 8,
  },
  themePreviewBar: {
    width: '100%',
    height: 4,
    borderRadius: 2,
    backgroundColor: '#1E88E5',
  },
  themeButtonText: {
    fontSize: 12,
    textAlign: 'center',
  },
  infoBox: {
    marginTop: 12,
    padding: 12,
    borderRadius: 8,
  },
  infoText: {
    fontSize: 13,
    lineHeight: 18,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  settingInfo: {
    flex: 1,
    marginRight: 12,
  },
  aboutText: {
    fontSize: 14,
    lineHeight: 20,
  },
});

export default SettingsScreen;
