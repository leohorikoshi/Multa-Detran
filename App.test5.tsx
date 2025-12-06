import React from 'react';
import { Provider } from 'react-redux';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, Text, StyleSheet } from 'react-native';
import { store } from './src/store';

// TESTE 5: Com Stack Navigator (tela simples inline)
const Stack = createNativeStackNavigator();

function TestScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>TESTE 5: Stack Navigator ✅</Text>
    </View>
  );
}

export default function App() {
  console.log('🧪 TESTE 5: Com Stack Navigator');
  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <NavigationContainer>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Test" component={TestScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#E91E63' },
  text: { fontSize: 24, color: '#fff', fontWeight: 'bold' },
});
