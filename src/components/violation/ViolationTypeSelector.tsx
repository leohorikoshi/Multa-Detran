import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ViolationTypeSelectorProps {
  types: string[];
  selectedType: string;
  onSelect: (type: string) => void;
  error?: string;
  disabled?: boolean;
}

export const ViolationTypeSelector: React.FC<ViolationTypeSelectorProps> = ({
  types,
  selectedType,
  onSelect,
  error,
  disabled,
}) => {
  const { width } = useWindowDimensions();
  const isSmallScreen = width < 380;

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {types.map((type) => (
          <TouchableOpacity
            key={type}
            style={[
              styles.typeButton,
              selectedType === type && styles.typeButtonSelected,
              isSmallScreen && styles.smallScreenButton,
              disabled && styles.typeButtonDisabled,
            ]}
            onPress={() => onSelect(type)}
            disabled={disabled}
          >
            {selectedType === type && (
              <Ionicons
                name="checkmark-circle"
                size={isSmallScreen ? 16 : 20}
                color="#1a73e8"
                style={styles.icon}
              />
            )}
            <Text
              style={[
                styles.typeText,
                selectedType === type && styles.typeTextSelected,
                isSmallScreen && styles.smallScreenText,
                disabled && styles.typeTextDisabled,
              ]}
            >
              {type}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  scrollContent: {
    paddingHorizontal: 4,
  },
  typeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    marginRight: 8,
    minWidth: 120,
    justifyContent: 'center',
  },
  typeButtonSelected: {
    backgroundColor: '#e8f0fe',
    borderWidth: 1,
    borderColor: '#1a73e8',
  },
  typeButtonDisabled: {
    opacity: 0.6,
  },
  smallScreenButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    minWidth: 100,
  },
  icon: {
    marginRight: 6,
  },
  typeText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  typeTextSelected: {
    color: '#1a73e8',
    fontWeight: '600',
  },
  typeTextDisabled: {
    color: '#999',
  },
  smallScreenText: {
    fontSize: 12,
  },
  errorText: {
    color: '#d32f2f',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
});