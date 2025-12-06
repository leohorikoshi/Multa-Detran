import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  Image,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
// import * as ImagePicker from 'expo-image-picker';
// import * as Location from 'expo-location';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { VIOLATION_TYPES } from '../constants';
import { Ionicons } from '@expo/vector-icons';
import { useViolationForm } from '../hooks/useViolationForm';
import { ImagePreview } from '../components/violation/ImagePreview';
import { LoadingOverlay } from '../components/ui';

type ReportViolationScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'ReportViolation'>;
};

export const ReportViolationScreen: React.FC<ReportViolationScreenProps> = ({
  navigation,
}) => {
  const [form, setForm] = useState({
    violationType: '',
    description: '',
    plateNumber: '',
    location: null as { latitude: number; longitude: number } | null,
    images: [] as string[],
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleTakePhoto = async () => {
    // Temporariamente desabilitado - requer módulo nativo
    setError('Funcionalidade de câmera disponível apenas no app nativo');
  };

  const getCurrentLocation = async () => {
    // Temporariamente desabilitado - requer módulo nativo
    setError('Funcionalidade de localização disponível apenas no app nativo');
  };

  const handleSubmit = async () => {
    // TODO: Implementar envio da denúncia
    console.log('Denúncia:', form);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Nova Denúncia</Text>

        <View style={styles.section}>
          <Text style={styles.label}>Tipo de Infração</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.typeContainer}>
            {VIOLATION_TYPES.map((type) => (
              <TouchableOpacity
                key={type}
                style={[
                  styles.typeButton,
                  form.violationType === type && styles.typeButtonSelected,
                ]}
                onPress={() => setForm(prev => ({ ...prev, violationType: type }))}
              >
                <Text style={[
                  styles.typeText,
                  form.violationType === type && styles.typeTextSelected,
                ]}>
                  {type}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Descrição</Text>
          <TextInput
            style={styles.input}
            multiline
            numberOfLines={4}
            placeholder="Descreva a situação..."
            value={form.description}
            onChangeText={(text) => setForm(prev => ({ ...prev, description: text }))}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Placa do Veículo (opcional)</Text>
          <TextInput
            style={styles.input}
            placeholder="AAA-0000"
            autoCapitalize="characters"
            value={form.plateNumber}
            onChangeText={(text) => setForm(prev => ({ ...prev, plateNumber: text }))}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Fotos</Text>
          <TouchableOpacity style={styles.photoButton} onPress={handleTakePhoto}>
            <Text style={styles.photoButtonText}>Tirar Foto</Text>
          </TouchableOpacity>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.photoList}>
            {form.images.map((uri, index) => (
              <Image key={index} source={{ uri }} style={styles.photoPreview} />
            ))}
          </ScrollView>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Localização</Text>
          <TouchableOpacity 
            style={[styles.locationButton, form.location && styles.locationButtonSuccess]} 
            onPress={getCurrentLocation}
          >
            <Text style={styles.locationButtonText}>
              {form.location ? 'Localização Obtida' : 'Obter Localização'}
            </Text>
          </TouchableOpacity>
        </View>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <TouchableOpacity 
          style={[styles.submitButton, loading && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={loading}
        >
          <Text style={styles.submitButtonText}>
            {loading ? 'Enviando...' : 'Enviar Denúncia'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#1a73e8',
  },
  section: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  typeContainer: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  typeButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    marginRight: 10,
  },
  typeButtonSelected: {
    backgroundColor: '#1a73e8',
  },
  typeText: {
    color: '#666',
  },
  typeTextSelected: {
    color: '#fff',
  },
  photoButton: {
    backgroundColor: '#1a73e8',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  photoButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  photoList: {
    flexDirection: 'row',
    marginTop: 10,
  },
  photoPreview: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginRight: 10,
  },
  locationButton: {
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  locationButtonSuccess: {
    backgroundColor: '#4caf50',
  },
  locationButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: '600',
  },
  errorText: {
    color: '#d32f2f',
    marginBottom: 15,
    textAlign: 'center',
  },
  submitButton: {
    backgroundColor: '#1a73e8',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonDisabled: {
    backgroundColor: '#ccc',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});