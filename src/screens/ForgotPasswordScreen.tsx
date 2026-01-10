import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';

type ForgotPasswordScreenProps = {
  navigation: any;
};

export const ForgotPasswordScreen: React.FC<ForgotPasswordScreenProps> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleResetPassword = async () => {
    setError('');
    
    if (!email.trim()) {
      setError('Por favor, digite seu e-mail');
      return;
    }

    if (!email.includes('@')) {
      setError('Por favor, digite um e-mail válido');
      return;
    }

    setLoading(true);
    
    // Simular envio de email
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
    }, 1500);
  };

  if (success) {
    return (
      <View style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.successIcon}>✅</Text>
          <Text style={styles.title}>E-mail Enviado!</Text>
          <Text style={styles.subtitle}>
            Instruções para redefinir sua senha foram enviadas para {email}
          </Text>
          <Text style={styles.infoText}>
            Verifique sua caixa de entrada e siga as instruções.
          </Text>

          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={styles.buttonText}>Voltar para o login</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Esqueceu sua senha?</Text>
        <Text style={styles.subtitle}>
          Digite seu e-mail para receber instruções de recuperação
        </Text>

        {error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        <TextInput
          style={styles.input}
          placeholder="E-mail"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleResetPassword}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? 'Enviando...' : 'Enviar instruções'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate('Login')}
          style={styles.backButton}
        >
          <Text style={styles.backButtonText}>Voltar para o login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  successIcon: {
    fontSize: 64,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1a73e8',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
    maxWidth: 400,
  },
  infoText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    marginBottom: 30,
    maxWidth: 400,
  },
  errorContainer: {
    backgroundColor: '#fee',
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
    width: '100%',
    maxWidth: 400,
  },
  errorText: {
    color: '#c00',
    fontSize: 14,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    maxWidth: 400,
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
    marginBottom: 20,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#1a73e8',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 8,
    width: '100%',
    maxWidth: 400,
    marginBottom: 20,
  },
  buttonDisabled: {
    backgroundColor: '#999',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  backButton: {
    marginTop: 10,
  },
  backButtonText: {
    color: '#1a73e8',
    fontSize: 14,
  },
});
