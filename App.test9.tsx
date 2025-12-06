import React from 'react';
import { Provider } from 'react-redux';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { store } from './src/store';

// Importando as telas REAIS
import { WelcomeScreen } from './src/screens/WelcomeScreen';
import { LoginScreen } from './src/screens/LoginScreen';
import { RegisterScreen } from './src/screens/RegisterScreen';

const Stack = createNativeStackNavigator();

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
  console.log('🚀 TESTE 9: Com telas REAIS + linking');
  
  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <NavigationContainer 
          linking={linking}
          onStateChange={(state) => {
            console.log('📍 Navigation state:', state);
          }}
        >
          <Stack.Navigator
            initialRouteName="Welcome"
            screenOptions={{
              headerShown: false,
            }}
          >
            <Stack.Screen name="Welcome" component={WelcomeScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    </Provider>
  );
}
