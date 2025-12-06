import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Provider } from 'react-redux';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { store } from './src/store';

// TESTE 4: React Native + Redux + SafeArea + NavigationContainer (sem Stack)
export default function App() {
  console.log('🧪 TESTE 4: Com NavigationContainer');
  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <NavigationContainer>
          <View style={styles.container}>
            <Text style={styles.text}>TESTE 4: NavigationContainer ✅</Text>
          </View>
        </NavigationContainer>
      </SafeAreaProvider>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#9C27B0' },
  text: { fontSize: 24, color: '#fff', fontWeight: 'bold' },
});
