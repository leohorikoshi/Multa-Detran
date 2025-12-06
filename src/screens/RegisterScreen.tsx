import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Alert,
  useWindowDimensions,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { useAppDispatch, useAppSelector } from '../hooks/useRedux';
import { register } from '../store/slices/authSlice';
import { Input, Button, PasswordInput } from '../components/ui/FormComponents';
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
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
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

  const { values, errors, touched, setValue, setFieldTouched, validateAllFields, isValid } = useFormValidation({
    rules: validationRules,
  });

  const handleRegister = useCallback(async () => {
    console.log('🔵 handleRegister chamado');
    console.log('📝 Values:', values);
    
    const validationResult = validateAllFields();
    console.log('✅ Validação:', validationResult);
    
    if (!validationResult) {
      console.log('❌ Validação falhou, erros:', errors);
      Alert.alert(
        'Campos Inválidos',
        'Por favor, verifique os campos destacados em vermelho e tente novamente.'
      );
      return;
    }

    const userData = {
      name: values.name,
      email: values.email.toLowerCase(),
      cpf: values.cpf.replace(/[^\d]/g, ''),
      password: values.password,
    };

    console.log('📤 Enviando dados:', userData);

    try {
      console.log('📤 Enviando registro...');
      const result = await dispatch(register(userData)).unwrap();
      console.log('✅ Registro bem-sucedido:', result);
      
      Alert.alert(
        'Sucesso!',
        'Sua conta foi criada com sucesso!',
        [
          { 
            text: 'OK',
            onPress: () => {
              console.log('📍 Navegando para Home após registro...');
              // A navegação será automática pelo Redux/Navigation
            }
          }
        ]
      );
    } catch (error: any) {
      console.error('❌ Erro capturado no RegisterScreen:', error);
      console.error('Tipo do erro:', typeof error);
      
      let errorMessage = 'Ocorreu um erro ao criar sua conta. Por favor, tente novamente.';
      
      // Se error é uma string (vem do throw no Redux)
      if (typeof error === 'string') {
        errorMessage = error;
      }
      // Se error tem uma propriedade message
      else if (error?.message) {
        errorMessage = error.message;
      }
      
      // Personalizar mensagens comuns
      if (errorMessage.includes('já cadastrado') || errorMessage.includes('already exists')) {
        errorMessage = 'Este email ou CPF já está cadastrado. Tente fazer login ou use outros dados.';
      }
      
      Alert.alert('Erro no Cadastro', errorMessage);
    }
  }, [dispatch, values, validateAllFields, errors]);

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
        <View style={[
          styles.scrollContent,
          isLandscape && styles.landscapeScrollContent
        ]}>
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
                onBlur={() => setFieldTouched('name')}
                error={touched.name ? errors.name : ''}
                autoCapitalize="words"
                returnKeyType="next"
                editable={!isLoading}
              />

              <Input
                label="E-mail"
                placeholder="Digite seu e-mail"
                value={values.email || ''}
                onChangeText={(value) => setValue('email', value)}
                onBlur={() => setFieldTouched('email')}
                error={touched.email ? errors.email : ''}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="next"
                editable={!isLoading}
              />

              <Input
                label="CPF"
                placeholder="Digite apenas números (11 dígitos)"
                value={values.cpf || ''}
                onChangeText={(value) => {
                  // Remove tudo que não é número
                  const numbers = value.replace(/[^\d]/g, '');
                  // Limita a 11 dígitos
                  if (numbers.length <= 11) {
                    setValue('cpf', numbers);
                  }
                }}
                onBlur={() => setFieldTouched('cpf')}
                error={touched.cpf ? errors.cpf : ''}
                keyboardType="numeric"
                returnKeyType="next"
                editable={!isLoading}
              />

              <PasswordInput
                label="Senha"
                placeholder="Digite sua senha"
                value={values.password || ''}
                onChangeText={(value) => setValue('password', value)}
                onBlur={() => setFieldTouched('password')}
                error={touched.password ? errors.password : ''}
                showPassword={showPassword}
                onTogglePassword={() => setShowPassword(!showPassword)}
                returnKeyType="next"
                editable={!isLoading}
              />

              <PasswordInput
                label="Confirmar Senha"
                placeholder="Digite sua senha novamente"
                value={values.confirmPassword || ''}
                onChangeText={(value) => setValue('confirmPassword', value)}
                onBlur={() => setFieldTouched('confirmPassword')}
                error={touched.confirmPassword ? errors.confirmPassword : ''}
                showPassword={showConfirmPassword}
                onTogglePassword={() => setShowConfirmPassword(!showConfirmPassword)}
                returnKeyType="done"
                editable={!isLoading}
              />
            </FormGroup>

            <FormGroup>
              <Button
                title="Criar conta"
                onPress={handleRegister}
                disabled={isLoading}
                loading={isLoading}
              />

              <Button
                title="Já tenho uma conta"
                onPress={() => navigation.navigate('Login')}
                variant="outline"
              />
            </FormGroup>
          </FormContainer>
        </View>
      </KeyboardAvoidingView>
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