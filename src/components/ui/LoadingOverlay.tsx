import React from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  View,
  Text,
  Modal,
  StyleProp,
  ViewStyle,
} from 'react-native';

interface LoadingOverlayProps {
  visible: boolean;
  message?: string;
  style?: StyleProp<ViewStyle>;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  visible,
  message = 'Carregando...',
  style,
}) => {
  if (!visible) return null;

  return (
    <Modal transparent animationType="fade">
      <View style={[styles.container, style]}>
        <View style={styles.content}>
          <ActivityIndicator size="large" color="#1a73e8" />
          <Text style={styles.message}>{message}</Text>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    gap: 12,
  },
  message: {
    color: '#333',
    fontSize: 16,
    marginTop: 8,
  },
});