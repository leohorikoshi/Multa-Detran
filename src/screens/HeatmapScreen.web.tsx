import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const HeatmapScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.icon}>🗺️</Text>
      <Text style={styles.title}>Mapa de Calor</Text>
      <Text style={styles.description}>
        Esta funcionalidade usa mapas nativos e está disponível apenas no aplicativo mobile.
      </Text>
      <Text style={styles.info}>
        Instale o app no seu celular para visualizar o mapa de calor das regiões com mais denúncias.
      </Text>
      <View style={styles.featuresBox}>
        <Text style={styles.featureTitle}>📱 No app mobile você verá:</Text>
        <Text style={styles.featureItem}>• Mapa interativo com marcadores</Text>
        <Text style={styles.featureItem}>• Regiões com maior concentração de infrações</Text>
        <Text style={styles.featureItem}>• Filtros por tipo de infração</Text>
        <Text style={styles.featureItem}>• Zoom e navegação pelo mapa</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  icon: {
    fontSize: 72,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
    color: '#1a73e8',
  },
  description: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 12,
    paddingHorizontal: 20,
  },
  info: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    marginBottom: 32,
    paddingHorizontal: 20,
  },
  featuresBox: {
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 12,
    width: '100%',
    maxWidth: 500,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
    color: '#333',
  },
  featureItem: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
    lineHeight: 22,
  },
});

export default HeatmapScreen;
