import { useState, useCallback } from 'react';
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
      
      // Funcionalidade desabilitada - requer módulos nativos
      Alert.alert(
        'Funcionalidade Indisponível',
        'A câmera está disponível apenas no aplicativo nativo. Para testes web, use a galeria de imagens.',
        [{ text: 'OK', style: 'cancel' }]
      );
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível capturar a foto. Tente novamente.');
    } finally {
      setLoading(prev => ({ ...prev, camera: false }));
    }
  }, []);

  const handlePickImage = useCallback(async () => {
    try {
      setLoading(prev => ({ ...prev, camera: true }));
      
      // Funcionalidade desabilitada - requer módulos nativos
      Alert.alert(
        'Funcionalidade Indisponível',
        'A seleção de imagens está disponível apenas no aplicativo nativo.',
        [{ text: 'OK', style: 'cancel' }]
      );
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível selecionar a foto. Tente novamente.');
    } finally {
      setLoading(prev => ({ ...prev, camera: false }));
    }
  }, []);

  const getCurrentLocation = useCallback(async () => {
    try {
      setLoading(prev => ({ ...prev, location: true }));
      
      // Funcionalidade desabilitada - requer módulos nativos
      Alert.alert(
        'Funcionalidade Indisponível',
        'A geolocalização está disponível apenas no aplicativo nativo.',
        [{ text: 'OK', style: 'cancel' }]
      );
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