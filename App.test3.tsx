import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Provider } from 'react-redux';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { store } from './src/store';

// TESTE 3: React Native + Redux + SafeAreaProvider
export default function App() {
  console.log('🧪 TESTE 3: React Native + Redux + SafeAreaProvider');
  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <View style={styles.container}>
          <Text style={styles.text}>TESTE 3: SafeArea ✅</Text>
        </View>
      </SafeAreaProvider>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FF9800' },
  text: { fontSize: 24, color: '#fff', fontWeight: 'bold' },
});
