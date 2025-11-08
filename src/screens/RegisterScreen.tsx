import React, { useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Alert,
  useWindowDimensions,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { useAppDispatch, useAppSelector } from '../hooks/useRedux';
import { register } from '../store/slices/authSlice';
import { Input, Button } from '../components/ui/FormComponents';
import { FormContainer, FormGroup } from '../components/ui/FormContainer';
import { LoadingOverlay } from '../components/ui';
import { useFormValidation, commonValidationRules } from '../hooks/useFormValidation';

type RegisterScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Register'>;
};

export const RegisterScreen: React.FC<RegisterScreenProps> = ({ navigation }) => {
  const { width, height } = useWindowDimensions();
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector((state) => state.auth);
  
  const isSmallScreen = width < 380;
  const isLandscape = width > height;

  const validationRules = {
    name: [
      commonValidationRules.required('O campo nome é obrigatório'),
      commonValidationRules.minLength(3, 'O nome deve ter no mínimo 3 caracteres'),
    ],
    email: [
      commonValidationRules.required('O campo email é obrigatório'),
      commonValidationRules.email('Por favor, insira um email válido'),
    ],
    cpf: [
      commonValidationRules.required('O campo CPF é obrigatório'),
      commonValidationRules.cpf('CPF inválido'),
    ],
    password: [
      commonValidationRules.required('O campo senha é obrigatório'),
      commonValidationRules.minLength(6, 'A senha deve ter no mínimo 6 caracteres'),
    ],
    confirmPassword: [
      commonValidationRules.required('Por favor, confirme sua senha'),
      {
        validate: (value: string) => value === values.password,
        message: 'As senhas não conferem',
      },
    ],
  };

  const { values, errors, touched, setValue, validateAllFields, isValid } = useFormValidation({
    rules: validationRules,
  });

  const handleRegister = useCallback(async () => {
    if (!validateAllFields()) {
      Alert.alert(
        'Campos Inválidos',
        'Por favor, verifique os campos destacados em vermelho e tente novamente.'
      );
      return;
    }

    try {
      await dispatch(register({
        name: values.name,
        email: values.email,
        cpf: values.cpf.replace(/[^\d]/g, ''),
        password: values.password,
      })).unwrap();
      Alert.alert(
        'Sucesso!',
        'Sua conta foi criada com sucesso. Você será redirecionado para a tela inicial.',
        [{ text: 'OK' }]
      );
      // Navegação será automática pelo NavigationContainer
    } catch (error: any) {
      const errorMessage = error.message === 'Email already exists'
        ? 'Este email já está cadastrado. Por favor, use outro email ou faça login.'
        : error.message || 'Ocorreu um erro ao criar sua conta. Por favor, tente novamente.';
      
      Alert.alert('Erro no Cadastro', errorMessage);
    }
  }, [dispatch, values, validateAllFields]);

  const formatCPF = (value: string) => {
    const numbers = value.replace(/[^\d]/g, '');
    if (numbers.length <= 3) return numbers;
    if (numbers.length <= 6) return `${numbers.slice(0, 3)}.${numbers.slice(3)}`;
    if (numbers.length <= 9) return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6)}`;
    return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6, 9)}-${numbers.slice(9, 11)}`;
  };

  const onChangeText = (field: string) => (value: string) => {
    setValue(field, value);
  };

  return (
    <SafeAreaView style={styles.container}>
      <LoadingOverlay 
        visible={isLoading}
        message="Criando sua conta..."
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={[styles.content, isLandscape && styles.landscapeContent]}
      >
        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            isLandscape && styles.landscapeScrollContent
          ]}
          showsVerticalScrollIndicator={false}
        >
          <View style={[styles.header, isLandscape && styles.landscapeHeader]}>
            <Text style={[styles.title, isSmallScreen && styles.smallScreenTitle]}>
              Criar Conta
            </Text>
            <Text style={[styles.subtitle, isSmallScreen && styles.smallScreenSubtitle]}>
              Preencha seus dados para se cadastrar
            </Text>
          </View>

          <FormContainer>
            <FormGroup>
              <Input
            label="Nome Completo"
            placeholder="Digite seu nome completo"
            value={values.name || ''}
            onChangeText={(value) => setValue('name', value)}
            error={touched.name ? errors.name : ''}
            autoCapitalize="words"
            returnKeyType="next"
            editable={!isLoading}
          />

          <Input
            label="E-mail"
            placeholder="Digite seu e-mail"
            value={values.email || ''}
            onChangeText={(value) => setValue('email', value.toLowerCase())}
            error={touched.email ? errors.email : ''}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="next"
          />

          <Input
            label="CPF"
            placeholder="Digite seu CPF"
            value={values.cpf || ''}
            onChangeText={(value) => setValue('cpf', formatCPF(value))}
            error={touched.cpf ? errors.cpf : ''}
            keyboardType="numeric"
            maxLength={14}
            returnKeyType="next"
          />

          <Input
            label="Senha"
            placeholder="Digite sua senha"
            value={values.password || ''}
            onChangeText={(value) => setValue('password', value)}
            error={touched.password ? errors.password : ''}
            secureTextEntry
            returnKeyType="next"
          />

          <Input
            label="Confirmar Senha"
            placeholder="Digite sua senha novamente"
            value={values.confirmPassword || ''}
            onChangeText={(value) => setValue('confirmPassword', value)}
            error={touched.confirmPassword ? errors.confirmPassword : ''}
            secureTextEntry
            returnKeyType="done"
          />
        </FormGroup>

        <FormGroup>
          <Button
            title="Criar conta"
            onPress={handleRegister}
            disabled={isLoading || !isValid}
            loading={isLoading}
          />

          <Button
            title="Já tenho uma conta"
            onPress={() => navigation.navigate('Login')}
            variant="outline"
          />
        </FormGroup>
      </FormContainer>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    minHeight: '100%',
  },
  landscapeContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  landscapeScrollContent: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-start',
    paddingHorizontal: 24,
  },
  header: {
    marginBottom: 32,
    width: '100%',
  },
  landscapeHeader: {
    marginBottom: 24,
    flex: 1,
    maxWidth: 600,
    alignSelf: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1a73e8',
    marginBottom: 8,
    textAlign: 'center',
  },
  smallScreenTitle: {
    fontSize: 24,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  smallScreenSubtitle: {
    fontSize: 14,
  },
  form: {
    flex: 1,
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
  },
  landscapeForm: {
    maxWidth: 800,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 16,
  },
  formGroup: {
    marginBottom: 24,
    flex: 1,
    minWidth: 280,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#1a73e8',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 15,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  } as const,
  linkText: {
    color: '#1a73e8',
    textAlign: 'center',
    fontSize: 14,
  },
});