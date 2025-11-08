import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { CachedImage } from '../ui/CachedImage';
import { Ionicons } from '@expo/vector-icons';

interface ImagePreviewProps {
  uri: string;
  onRemove: () => void;
  isFirstImage?: boolean;
}

const { width } = Dimensions.get('window');
const PREVIEW_SIZE = Math.min(width * 0.25, 120);

export const ImagePreview: React.FC<ImagePreviewProps> = ({ uri, onRemove, isFirstImage }) => {
  return (
    <View style={[styles.container, isFirstImage && styles.firstImage]}>
      <CachedImage
        source={{ uri }}
        style={styles.image}
        loadingComponent={
          <View style={styles.loading}>
            <ActivityIndicator color="#1a73e8" />
          </View>
        }
      />
      <TouchableOpacity style={styles.removeButton} onPress={onRemove}>
        <Ionicons name="close-circle" size={24} color="#ff4444" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginRight: 10,
  },
  firstImage: {
    borderWidth: 2,
    borderColor: '#1a73e8',
    borderRadius: 8,
  },
  image: {
    width: PREVIEW_SIZE,
    height: PREVIEW_SIZE,
    borderRadius: 8,
  },
  loading: {
    width: PREVIEW_SIZE,
    height: PREVIEW_SIZE,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: 'white',
    borderRadius: 12,
  },
});