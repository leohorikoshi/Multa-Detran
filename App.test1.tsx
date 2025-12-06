import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

// TESTE 1: React Native puro - SABEMOS QUE FUNCIONA (tela verde)
export default function App() {
  console.log('✅ TESTE 1: React Native puro');
  return (
    <View style={styles.container}>
      <Text style={styles.text}>TESTE 1: React Native ✅</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#4CAF50' },
  text: { fontSize: 24, color: '#fff', fontWeight: 'bold' },
});
