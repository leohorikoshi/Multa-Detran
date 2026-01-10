import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';

interface GovBrHeaderProps {
  title?: string;
  showBack?: boolean;
  onBackPress?: () => void;
}

export const GovBrHeader: React.FC<GovBrHeaderProps> = ({ 
  title = 'DetranDenuncia',
  showBack = false,
  onBackPress 
}) => {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.primary }]}>
      {/* Header principal */}
      <View style={styles.mainHeader}>
        {showBack && (
          <TouchableOpacity 
            onPress={onBackPress}
            style={styles.backButton}
          >
            <Text style={[styles.backIcon, { color: colors.textInverse }]}>←</Text>
          </TouchableOpacity>
        )}
        
        <View style={styles.titleContainer}>
          <Text style={[styles.title, { color: colors.textInverse }]}>
            {title}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    ...Platform.select({
      web: {
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      },
      default: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
      },
    }),
  },
  mainHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 12,
  },
  backButton: {
    padding: 8,
  },
  backIcon: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});
