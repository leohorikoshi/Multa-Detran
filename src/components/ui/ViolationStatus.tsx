import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface ViolationStatusProps {
  status: 'pending' | 'approved' | 'rejected';
}

export const ViolationStatus: React.FC<ViolationStatusProps> = ({ status }) => {
  const getStatusColor = () => {
    switch (status) {
      case 'pending':
        return '#F9A825';
      case 'approved':
        return '#4CAF50';
      case 'rejected':
        return '#F44336';
      default:
        return '#999';
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'pending':
        return 'Pendente';
      case 'approved':
        return 'Aprovada';
      case 'rejected':
        return 'Rejeitada';
      default:
        return status;
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: getStatusColor() }]}>
      <Text style={styles.text}>{getStatusText()}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  text: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
});