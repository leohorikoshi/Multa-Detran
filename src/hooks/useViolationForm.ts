import { useState, useCallback } from 'react';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { Alert } from 'react-native';

interface ViolationForm {
  violationType: string;
  description: string;
  plateNumber: string;
  location: { latitude: number; longitude: number } | null;
  images: string[];
}

interface UseViolationFormReturn {
  form: ViolationForm;
  errors: Partial<Record<keyof ViolationForm, string>>;
  loading: {
    camera: boolean;
    location: boolean;
    submit: boolean;
  };
  handleTakePhoto: () => Promise<void>;
  handlePickImage: () => Promise<void>;
  getCurrentLocation: () => Promise<void>;
  setFormField: <K extends keyof ViolationForm>(field: K, value: ViolationForm[K]) => void;
  validateForm: () => boolean;
  resetForm: () => void;
}

export const useViolationForm = (): UseViolationFormReturn => {
  const [form, setForm] = useState<ViolationForm>({
    violationType: '',
    description: '',
    plateNumber: '',
    location: null,
    images: [],
  });

  const [errors, setErrors] = useState<Partial<Record<keyof ViolationForm, string>>>({});
  const [loading, setLoading] = useState({
    camera: false,
    location: false,
    submit: false,
  });

  const setFormField = useCallback(<K extends keyof ViolationForm>(
    field: K,
    value: ViolationForm[K]
  ) => {
    setForm(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: '' }));
  }, []);

  const handleTakePhoto = useCallback(async () => {
    try {
      setLoading(prev => ({ ...prev, camera: true }));
      
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permissão necessária',
          'Precisamos da sua permissão para acessar a câmera.',
          [
            { text: 'Cancelar', style: 'cancel' },
            { 
              text: 'Abrir Configurações',
              onPress: () => ImagePicker.requestCameraPermissionsAsync()
            }
          ]
        );
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.8,
        allowsEditing: true,
        aspect: [4, 3],
      });

      if (!result.canceled && result.assets[0].uri) {
        setForm(prev => ({
          ...prev,
          images: [...prev.images, result.assets[0].uri],
        }));
      }
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível capturar a foto. Tente novamente.');
    } finally {
      setLoading(prev => ({ ...prev, camera: false }));
    }
  }, []);

  const handlePickImage = useCallback(async () => {
    try {
      setLoading(prev => ({ ...prev, camera: true }));
      
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permissão necessária',
          'Precisamos da sua permissão para acessar a galeria.',
          [
            { text: 'Cancelar', style: 'cancel' },
            { 
              text: 'Abrir Configurações',
              onPress: () => ImagePicker.requestMediaLibraryPermissionsAsync()
            }
          ]
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.8,
        allowsEditing: true,
        aspect: [4, 3],
      });

      if (!result.canceled && result.assets[0].uri) {
        setForm(prev => ({
          ...prev,
          images: [...prev.images, result.assets[0].uri],
        }));
      }
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível selecionar a foto. Tente novamente.');
    } finally {
      setLoading(prev => ({ ...prev, camera: false }));
    }
  }, []);

  const getCurrentLocation = useCallback(async () => {
    try {
      setLoading(prev => ({ ...prev, location: true }));
      
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permissão necessária',
          'Precisamos da sua permissão para acessar a localização.',
          [
            { text: 'Cancelar', style: 'cancel' },
            { 
              text: 'Abrir Configurações',
              onPress: () => Location.requestForegroundPermissionsAsync()
            }
          ]
        );
        return;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      setForm(prev => ({
        ...prev,
        location: {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        },
      }));
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível obter sua localização. Tente novamente.');
    } finally {
      setLoading(prev => ({ ...prev, location: false }));
    }
  }, []);

  const validateForm = useCallback(() => {
    const newErrors: Partial<Record<keyof ViolationForm, string>> = {};

    if (!form.violationType) {
      newErrors.violationType = 'Selecione o tipo de infração';
    }

    if (!form.description) {
      newErrors.description = 'Descreva a situação';
    } else if (form.description.length < 10) {
      newErrors.description = 'A descrição deve ter pelo menos 10 caracteres';
    }

    if (form.plateNumber && !/^[A-Z]{3}-\d{4}$/.test(form.plateNumber)) {
      newErrors.plateNumber = 'Formato inválido. Use AAA-0000';
    }

    if (form.images.length === 0) {
      newErrors.images = 'Adicione pelo menos uma foto';
    }

    if (!form.location) {
      newErrors.location = 'Obtenha a localização da infração';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [form]);

  const resetForm = useCallback(() => {
    setForm({
      violationType: '',
      description: '',
      plateNumber: '',
      location: null,
      images: [],
    });
    setErrors({});
  }, []);

  return {
    form,
    errors,
    loading,
    handleTakePhoto,
    handlePickImage,
    getCurrentLocation,
    setFormField,
    validateForm,
    resetForm,
  };
};