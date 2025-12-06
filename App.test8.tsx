import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Platform } from 'react-native';
import { Provider } from 'react-redux';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { store } from './src/store';

const Stack = createNativeStackNavigator();

// Tela de teste com alert
function TestWelcomeScreen({ navigation }: any) {
  const handlePress = (screen: string) => {
    console.log('🔵 Botão clicado:', screen);
    
    if (Platform.OS === 'web') {
      window.alert(`Tentando navegar para: ${screen}`);
    } else {
      Alert.alert('Navegação', `Tentando navegar para: ${screen}`);
    }
    
    try {
      console.log('🔵 Chamando navigation.navigate...');
      navigation.navigate(screen);
      console.log('✅ navigation.navigate executado');
    } catch (error) {
      console.error('❌ Erro ao navegar:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>TESTE 8: Navegação com Debug</Text>
      
      <TouchableOpacity
        style={[styles.button, { backgroundColor: '#4CAF50' }]}
        onPress={() => handlePress('Login')}
      >
        <Text style={styles.buttonText}>IR PARA LOGIN</Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={[styles.button, { backgroundColor: '#2196F3' }]}
        onPress={() => handlePress('Register')}
      >
        <Text style={styles.buttonText}>IR PARA REGISTER</Text>
      </TouchableOpacity>
    </View>
  );
}

function LoginScreen() {
  return (
    <View style={[styles.container, { backgroundColor: '#4CAF50' }]}>
      <Text style={styles.title}>✅ LOGIN SCREEN FUNCIONOU!</Text>
    </View>
  );
}

function RegisterScreen() {
  return (
    <View style={[styles.container, { backgroundColor: '#2196F3' }]}>
      <Text style={styles.title}>✅ REGISTER SCREEN FUNCIONOU!</Text>
    </View>
  );
}

const linking = {
  prefixes: ['http://localhost:8081'],
  config: {
    screens: {
      Welcome: '',
      Login: 'login',
      Register: 'register',
    },
  },
};

export default function App() {
  console.log('🚀 App.test8 iniciando...');
  
  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <NavigationContainer 
          linking={linking}
          onStateChange={(state) => {
            console.log('📍 Navigation state changed:', state);
          }}
        >
          <Stack.Navigator
            initialRouteName="Welcome"
            screenOptions={{
              headerShown: false,
            }}
          >
            <Stack.Screen name="Welcome" component={TestWelcomeScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFD700',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 30,
    textAlign: 'center',
  },
  button: {
    padding: 20,
    borderRadius: 8,
    marginVertical: 10,
    minWidth: 250,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
