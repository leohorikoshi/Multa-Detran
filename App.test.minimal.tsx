import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function App() {
  console.log('=== APP INICIADO ===');
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>DetranDenuncia Funcionando!</Text>
      <Text style={styles.subtitle}>Se você vê isso, o React Native Web está OK</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a73e8',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 18,
    color: '#fff',
  },
});
