import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { RootStackScreenProps } from '../types/navigation';
import { Violation } from '../types/models';
import api from '../utils/api';
import { formatDate } from '../utils/format';
import { ViolationStatus } from '../components/ui';

export const AdminDashboard = () => {
  const [violations, setViolations] = useState<Violation[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();

  const loadViolations = async () => {
    try {
      setLoading(true);
      const response = await api.get('/violations');
      setViolations(response.data.data.violations);
    } catch (error: any) {
      Alert.alert('Erro', error.message || 'Erro ao carregar denúncias');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadViolations().finally(() => setRefreshing(false));
  };

  useEffect(() => {
    loadViolations();
  }, []);

  const handleViolationPress = (violation: Violation) => {
    navigation.navigate('ViolationDetails', { violationId: violation._id });
  };

  const renderViolationItem = ({ item }: { item: Violation }) => (
    <TouchableOpacity
      style={styles.violationItem}
      onPress={() => handleViolationPress(item)}
    >
      <View style={styles.violationHeader}>
        <Text style={styles.plateNumber}>{item.plateNumber}</Text>
        <ViolationStatus status={item.status} />
      </View>

      <Text style={styles.location}>{item.location.address}</Text>
      
      <View style={styles.violationFooter}>
        <Text style={styles.date}>{formatDate(item.createdAt)}</Text>
        <Text style={styles.imagesCount}>{item.images.length} fotos</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Painel Administrativo</Text>

      <FlatList
        data={violations}
        renderItem={renderViolationItem}
        keyExtractor={(item) => item._id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          !loading ? (
            <Text style={styles.emptyText}>Nenhuma denúncia encontrada</Text>
          ) : null
        }
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  listContent: {
    padding: 16,
  },
  violationItem: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  violationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  plateNumber: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  location: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  violationFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  date: {
    fontSize: 12,
    color: '#999',
  },
  imagesCount: {
    fontSize: 12,
    color: '#999',
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
    marginTop: 24,
  },
});