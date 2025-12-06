import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { useAppDispatch, useAppSelector } from '../hooks/useRedux';
import { login } from '../store/slices/authSlice';
import { Input, Button, PasswordInput } from '../components/ui/FormComponents';
import { LoadingOverlay } from '../components/ui';

type LoginScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Login'>;
};

export const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [validation, setValidation] = useState({ email: '', password: '' });
  const [errorMessage, setErrorMessage] = useState('');

  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector((state) => state.auth);

  const validate = () => {
    const errors = {
      email: '',
      password: ''
    };

    if (!email) {
      errors.email = 'O campo email é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Por favor, insira um email válido';
    }

    if (!password) {
      errors.password = 'O campo senha é obrigatório';
    } else if (password.length < 6) {
      errors.password = 'A senha deve conter pelo menos 6 caracteres';
    }

    setValidation(errors);
    return !errors.email && !errors.password;
  };

  const handleLogin = async () => {
    setErrorMessage(''); // Limpar erro anterior
    
    if (!validate()) {
      setErrorMessage('Por favor, verifique os campos destacados em vermelho e tente novamente.');
      return;
    }

    try {
      console.log('🔐 Iniciando login...');
      const result = await dispatch(login({ email, password })).unwrap();
      console.log('✅ Login concluído:', result);
      console.log('✅ Token recebido:', result.token ? 'Sim' : 'Não');
      console.log('✅ User recebido:', result.user?.email);
      
      // Não precisa navegar manualmente - o Redux vai re-renderizar o NavigationContainer
      console.log('📍 Redux state atualizado, NavigationContainer vai re-renderizar automaticamente');
    } catch (error: any) {
      console.error('❌ Erro capturado no handleLogin:', error);
      
      // Mapear erros para mensagens amigáveis
      let errorMsg = 'Ocorreu um erro inesperado. Tente novamente.';
      
      if (typeof error === 'string') {
        if (error.includes('senha') || error.includes('Senha') || error.includes('incorreta')) {
          errorMsg = '❌ Email ou senha incorretos. Verifique seus dados e tente novamente.';
        } else if (error.includes('não encontrado') || error.includes('not found')) {
          errorMsg = '❌ Usuário não encontrado. Verifique o email digitado.';
        } else {
          errorMsg = `❌ ${error}`;
        }
      }
      
      setErrorMessage(errorMsg);
      console.error('💬 Mensagem de erro exibida:', errorMsg);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <LoadingOverlay 
        visible={isLoading}
        message="Entrando na sua conta..."
      />
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Bem-vindo de volta!</Text>
          <Text style={styles.subtitle}>Acesse sua conta para continuar</Text>
        </View>

        {errorMessage ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{errorMessage}</Text>
          </View>
        ) : null}

        <View style={styles.form}>
          <Input
            placeholder="Email"
            value={email}
            onChangeText={(text: string) => {
              setEmail(text);
              setValidation(prev => ({ ...prev, email: '' }));
            }}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            error={validation.email}
            editable={!isLoading}
          />

          <PasswordInput
            placeholder="Senha"
            value={password}
            onChangeText={(text: string) => {
              setPassword(text);
              setValidation(prev => ({ ...prev, password: '' }));
            }}
            showPassword={showPassword}
            onTogglePassword={() => setShowPassword(!showPassword)}
            error={validation.password}
            editable={!isLoading}
          />

          <TouchableOpacity
            onPress={() => navigation.navigate('ForgotPassword')}
            style={styles.forgotPassword}
            disabled={isLoading}
          >
            <Text style={styles.forgotPasswordText}>
              Esqueceu sua senha?
            </Text>
          </TouchableOpacity>

          <Button
            title="Entrar"
            onPress={handleLogin}
            disabled={isLoading}
          />

          <View style={styles.registerContainer}>
            <Text style={styles.registerText}>
              Ainda não tem uma conta?{' '}
            </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('Register')}
              disabled={isLoading}
            >
              <Text style={styles.registerLink}>
                Criar conta
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
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
    padding: 20,
    justifyContent: 'center',
    maxWidth: 500,
    width: '100%',
    alignSelf: 'center',
  },
  header: {
    marginBottom: 30,
    width: '100%',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1a73e8',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  errorContainer: {
    backgroundColor: '#ffebee',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    borderLeftWidth: 4,
    borderLeftColor: '#f44336',
  },
  errorText: {
    color: '#c62828',
    fontSize: 14,
    fontWeight: '500',
  },
  form: {
    width: '100%',
    gap: 15,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginVertical: 10,
    padding: 4,
  },
  forgotPasswordText: {
    color: '#1a73e8',
    fontSize: 14,
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
    flexWrap: 'wrap',
  },
  registerText: {
    color: '#666',
    fontSize: 14,
  },
  registerLink: {
    color: '#1a73e8',
    fontSize: 14,
    fontWeight: '600',
  },
});