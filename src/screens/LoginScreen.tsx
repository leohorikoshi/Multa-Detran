import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  useWindowDimensions,
  ScrollView,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { useAppDispatch, useAppSelector } from '../hooks/useRedux';
import { login } from '../store/slices/authSlice';
import { Input, Button } from '../components/ui/FormComponents';
import { LoadingOverlay } from '../components/ui';

type LoginScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Login'>;
};

export const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const { width, height } = useWindowDimensions();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [validation, setValidation] = useState({ email: '', password: '' });
  
  const isSmallScreen = width < 380;
  const isLandscape = width > height;

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

    setValidation(errors);
    return !errors.email && !errors.password;
  };

  const handleLogin = async () => {
    if (!validate()) {
      Alert.alert(
        'Campos Inválidos',
        'Por favor, verifique os campos destacados em vermelho e tente novamente.'
      );
      return;
    }

    try {
      await dispatch(login({ email, password })).unwrap();
      navigation.replace('Home');
    } catch (error: any) {
      const errorMessages: { [key: string]: string } = {
        'Invalid credentials': 'Email ou senha incorretos',
        'User not found': 'Usuário não encontrado',
        'Account not verified': 'Conta não verificada. Verifique seu email',
        'Account disabled': 'Conta desativada. Entre em contato com o suporte'
      };

      Alert.alert(
        'Erro ao fazer login',
        errorMessages[error?.message] || 'Ocorreu um erro inesperado. Tente novamente mais tarde'
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <LoadingOverlay 
        visible={isLoading}
        message="Entrando na sua conta..."
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={[
          styles.content,
          isLandscape && styles.landscapeContent,
          { padding: isSmallScreen ? 16 : 20 }
        ]}
      >
        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            isLandscape && styles.landscapeScrollContent
          ]}
          showsVerticalScrollIndicator={false}
        >
        <View style={styles.header}>
          <Text style={styles.title}>Bem-vindo de volta!</Text>
          <Text style={styles.subtitle}>Acesse sua conta para continuar</Text>
        </View>

        <View style={[styles.form, isLandscape && styles.landscapeForm]}>
          <View style={styles.inputContainer}>
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
              style={isSmallScreen && styles.smallScreenInput}
            />

            <Input
              placeholder="Senha"
              value={password}
              onChangeText={(text: string) => {
                setPassword(text);
                setValidation(prev => ({ ...prev, password: '' }));
              }}
              secureTextEntry
              error={validation.password}
              editable={!isLoading}
              style={isSmallScreen && styles.smallScreenInput}
            />

            <TouchableOpacity
              onPress={() => navigation.navigate('ForgotPassword')}
              style={[styles.forgotPassword, isSmallScreen && styles.smallScreenForgotPassword]}
              disabled={isLoading}
            >
              <Text style={[styles.forgotPasswordText, isSmallScreen && styles.smallScreenText]}>
                Esqueceu sua senha?
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.buttonContainer}>
            <Button
              title="Entrar"
              onPress={handleLogin}
              disabled={isLoading}
              style={isSmallScreen && styles.smallScreenButton}
            />

            <View style={styles.registerContainer}>
              <Text style={[styles.registerText, isSmallScreen && styles.smallScreenText]}>
                Ainda não tem uma conta?{' '}
              </Text>
              <TouchableOpacity
                onPress={() => navigation.navigate('Register')}
                disabled={isLoading}
              >
                <Text style={[styles.registerLink, isSmallScreen && styles.smallScreenText]}>
                  Criar conta
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        
          <LoadingOverlay visible={isLoading} message="Aguarde, autenticando..." />
        </ScrollView>
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
  },
  landscapeScrollContent: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  header: {
    marginBottom: 40,
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
  },
  form: {
    flex: 1,
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
    gap: 16,
  },
  landscapeForm: {
    flexDirection: 'row',
    maxWidth: 800,
    justifyContent: 'space-between',
    gap: 32,
  },
  inputContainer: {
    flex: 1,
    minWidth: 280,
    maxWidth: 400,
  },
  buttonContainer: {
    flex: 1,
    minWidth: 280,
    maxWidth: 400,
    justifyContent: 'center',
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 20,
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
  smallScreenInput: {
    minHeight: 40,
  },
  smallScreenButton: {
    minHeight: 40,
  },
  smallScreenText: {
    fontSize: 12,
  },
  smallScreenForgotPassword: {
    marginBottom: 16,
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
  } as const,
  errorText: {
    color: '#d32f2f',
    textAlign: 'center',
    marginBottom: 15,
    fontSize: 14
  }
});
    fontSize: 14,
  } as const,
});