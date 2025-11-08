import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Violation } from '../types/models';
import api from '../utils/api';
import { formatDate } from '../utils/format';
import { ViolationStatus } from '../components/ui/ViolationStatus';
import { FormButton, FormInput } from '../components/ui';

export const ViolationDetailsScreen = () => {
  const [violation, setViolation] = useState<Violation | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [reviewNotes, setReviewNotes] = useState('');
  const route = useRoute();
  const navigation = useNavigation();
  const { violationId } = route.params as { violationId: string };

  const loadViolation = async () => {
    try {
      const response = await api.get(`/violations/${violationId}`);
      setViolation(response.data.data.violation);
    } catch (error: any) {
      Alert.alert('Erro', error.message || 'Erro ao carregar denúncia');
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadViolation();
  }, [violationId]);

  const handleUpdateStatus = async (status: 'approved' | 'rejected') => {
    try {
      setUpdating(true);
      await api.patch(`/violations/${violationId}/status`, {
        status,
        reviewNotes,
      });
      Alert.alert('Sucesso', 'Status atualizado com sucesso');
      loadViolation();
    } catch (error: any) {
      Alert.alert('Erro', error.message || 'Erro ao atualizar status');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1a73e8" />
      </View>
    );
  }

  if (!violation) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Denúncia não encontrada</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.plateNumber}>{violation.plateNumber}</Text>
        <ViolationStatus status={violation.status} />
      </View>

      <View style={styles.infoSection}>
        <Text style={styles.label}>Local</Text>
        <Text style={styles.value}>{violation.location.address}</Text>

        <Text style={styles.label}>Descrição</Text>
        <Text style={styles.value}>{violation.description}</Text>

        <Text style={styles.label}>Data</Text>
        <Text style={styles.value}>{formatDate(violation.createdAt)}</Text>

        <Text style={styles.label}>Denunciante</Text>
        <Text style={styles.value}>
          {typeof violation.user === 'object' ? violation.user.name : 'Anônimo'}
        </Text>
      </View>

      <View style={styles.imagesSection}>
        <Text style={styles.imagesTitle}>Fotos ({violation.images.length})</Text>
        <ScrollView horizontal>
          {violation.images.map((image: string, index: number) => (
            <Image
              key={index}
              source={{ uri: image }}
              style={styles.image}
              resizeMode="cover"
            />
          ))}
        </ScrollView>
      </View>

      {violation.status === 'pending' && (
        <View style={styles.reviewSection}>
          <Text style={styles.reviewTitle}>Avaliar Denúncia</Text>
          
          <FormInput
            placeholder="Observações (opcional)"
            value={reviewNotes}
            onChangeText={setReviewNotes}
            multiline
            numberOfLines={4}
            style={styles.reviewInput}
          />

          <View style={styles.buttonRow}>
            <FormButton
              title={updating ? 'Aprovando...' : 'Aprovar'}
              onPress={() => handleUpdateStatus('approved')}
              disabled={updating}
              style={[styles.button, styles.approveButton]}
            />
            <FormButton
              title={updating ? 'Rejeitando...' : 'Rejeitar'}
              onPress={() => handleUpdateStatus('rejected')}
              disabled={updating}
              style={[styles.button, styles.rejectButton]}
            />
          </View>
        </View>
      )}

      {violation.reviewNotes && (
        <View style={styles.notesSection}>
          <Text style={styles.label}>Observações do Revisor</Text>
          <Text style={styles.value}>{violation.reviewNotes}</Text>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  errorText: {
    color: '#666',
    fontSize: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  plateNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  infoSection: {
    padding: 16,
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    color: '#333',
    marginBottom: 16,
  },
  imagesSection: {
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  imagesTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  image: {
    width: 200,
    height: 200,
    marginRight: 8,
    borderRadius: 8,
  },
  reviewSection: {
    padding: 16,
  },
  reviewTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  reviewInput: {
    height: 100,
    textAlignVertical: 'top',
    marginBottom: 16,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    marginHorizontal: 4,
  },
  approveButton: {
    backgroundColor: '#4CAF50',
  },
  rejectButton: {
    backgroundColor: '#F44336',
  },
  notesSection: {
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
});