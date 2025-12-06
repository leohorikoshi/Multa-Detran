import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Provider } from 'react-redux';
import { store } from './src/store';

// TESTE 2: React Native + Redux (sem Navigation)
export default function App() {
  console.log('🧪 TESTE 2: React Native + Redux');
  return (
    <Provider store={store}>
      <View style={styles.container}>
        <Text style={styles.text}>TESTE 2: Redux ✅</Text>
      </View>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#2196F3' },
  text: { fontSize: 24, color: '#fff', fontWeight: 'bold' },
});
