import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  RefreshControl,
  Alert,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { useTheme } from '../contexts/ThemeContext';
import { GovBrHeader } from '../components/ui/GovBrHeader';
import { API_BASE_URL } from '../constants';

type AdminUsersScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'AdminUsers'>;
};

interface User {
  _id: string;
  id?: string;
  name: string;
  email: string;
  cpf: string;
  role?: string;
  createdAt: string;
}

export const AdminUsersScreen: React.FC<AdminUsersScreenProps> = ({ navigation }) => {
  const { colors } = useTheme();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchUsers = async () => {
    try {
      console.log('📥 Buscando usuários do backend...');
      const response = await fetch(`${API_BASE_URL}/admin/users`);
      const data = await response.json();
      
      console.log('✅ Usuários recebidos:', data);
      setUsers(data.data || []);
    } catch (error) {
      console.error('❌ Erro ao buscar usuários:', error);
      Alert.alert('Erro', 'Não foi possível carregar os usuários.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchUsers();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatCPF = (cpf: string) => {
    if (!cpf) return 'N/A';
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  };

  const renderUser = ({ item }: { item: User }) => (
    <View style={[styles.userCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <View style={styles.userHeader}>
        <Text style={[styles.userName, { color: colors.text }]}>👤 {item.name}</Text>
        <View style={[styles.roleBadge, { backgroundColor: colors.primary }]}>
          <Text style={styles.roleText}>{item.role || 'user'}</Text>
        </View>
      </View>
      
      <View style={styles.userInfo}>
        <View style={styles.infoRow}>
          <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Email:</Text>
          <Text style={[styles.infoValue, { color: colors.text }]}>{item.email}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>CPF:</Text>
          <Text style={[styles.infoValue, { color: colors.text }]}>{formatCPF(item.cpf)}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>ID:</Text>
          <Text style={[styles.infoValue, { color: colors.textTertiary }]} numberOfLines={1}>
            {item._id || item.id}
          </Text>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Cadastro:</Text>
          <Text style={[styles.infoValue, { color: colors.textSecondary }]}>
            {formatDate(item.createdAt)}
          </Text>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <GovBrHeader 
        title="Usuários Cadastrados" 
        showBack 
        onBackPress={() => navigation.goBack()}
      />
      
      <View style={styles.header}>
        <Text style={[styles.totalText, { color: colors.text }]}>
          Total: {users.length} usuário{users.length !== 1 ? 's' : ''}
        </Text>
        <TouchableOpacity 
          style={[styles.refreshButton, { backgroundColor: colors.primary }]}
          onPress={onRefresh}
        >
          <Text style={styles.refreshButtonText}>🔄 Atualizar</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.centerContainer}>
          <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
            Carregando usuários...
          </Text>
        </View>
      ) : users.length === 0 ? (
        <View style={styles.centerContainer}>
          <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
            📭 Nenhum usuário cadastrado
          </Text>
          <Text style={[styles.emptySubtext, { color: colors.textTertiary }]}>
            Crie uma conta para ver usuários aqui
          </Text>
        </View>
      ) : (
        <FlatList
          data={users}
          renderItem={renderUser}
          keyExtractor={(item) => item._id || item.id || item.email}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={colors.primary}
            />
          }
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  totalText: {
    fontSize: 18,
    fontWeight: '600',
  },
  refreshButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 100,
  },
  refreshButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    fontSize: 16,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
  },
  list: {
    padding: 16,
  },
  userCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  userHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  userName: {
    fontSize: 18,
    fontWeight: '700',
    flex: 1,
  },
  roleBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 100,
  },
  roleText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  userInfo: {
    gap: 8,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: '600',
    width: 80,
  },
  infoValue: {
    fontSize: 14,
    flex: 1,
  },
});
