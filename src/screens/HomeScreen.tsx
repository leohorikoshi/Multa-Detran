import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useAppDispatch, useAppSelector } from '../hooks/useRedux';
import { logout } from '../store/slices/authSlice';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';

type HomeScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Home'>;
};

export const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);

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

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.welcomeText}>Olá, {user?.name}</Text>
        <View style={styles.headerButtons}>
          <TouchableOpacity onPress={handleSettings} style={styles.settingsButton}>
            <Text style={styles.settingsText}>⚙️</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
            <Text style={styles.logoutText}>Sair</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.content}>
        <TouchableOpacity style={styles.mainButton} onPress={handleNewReport}>
          <Text style={styles.mainButtonText}>Nova Denúncia</Text>
          <Text style={styles.buttonDescription}>
            Registrar uma nova infração de trânsito
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.secondaryButton} onPress={handleMyReports}>
          <Text style={styles.secondaryButtonText}>Minhas Denúncias</Text>
          <Text style={styles.buttonDescription}>
            Acompanhar status das denúncias enviadas
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.infoSection}>
        <Text style={styles.infoTitle}>Importante</Text>
        <Text style={styles.infoText}>
          • Todas as denúncias são analisadas por agentes do DETRAN
        </Text>
        <Text style={styles.infoText}>
          • Forneça o máximo de detalhes possível
        </Text>
        <Text style={styles.infoText}>
          • Falsas denúncias podem resultar em penalidades
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 20,
    backgroundColor: '#1a73e8',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: '600',
  },
  headerButtons: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  settingsButton: {
    padding: 8,
  },
  settingsText: {
    fontSize: 20,
  },
  logoutButton: {
    padding: 8,
  },
  logoutText: {
    color: '#fff',
    fontSize: 14,
  },
  content: {
    padding: 20,
    gap: 20,
  },
  mainButton: {
    backgroundColor: '#1a73e8',
    padding: 20,
    borderRadius: 10,
    elevation: 3,
  },
  mainButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  secondaryButton: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#1a73e8',
  },
  secondaryButtonText: {
    color: '#1a73e8',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  buttonDescription: {
    color: '#666',
    fontSize: 14,
  },
  infoSection: {
    padding: 20,
    backgroundColor: '#f5f5f5',
    margin: 20,
    borderRadius: 10,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
});