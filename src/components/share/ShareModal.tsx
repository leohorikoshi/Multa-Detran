import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { Colors } from '../../constants/colors';
import type { ShareViolationData } from '../../utils/shareService';
import * as ShareService from '../../utils/shareService';

interface ShareModalProps {
  visible: boolean;
  onClose: () => void;
  violationData: ShareViolationData;
}

interface ShareOption {
  id: string;
  name: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  action: () => Promise<boolean>;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  visible,
  onClose,
  violationData,
}) => {
  const { theme, colors: themeColors } = useTheme();
  const [isSharing, setIsSharing] = useState(false);

  const handleShare = async (
    platform: string,
    shareFunction: () => Promise<boolean>
  ) => {
    setIsSharing(true);
    try {
      const success = await shareFunction();
      if (success) {
        Alert.alert(
          'Sucesso!',
          `Denúncia compartilhada via ${platform}`,
          [{ text: 'OK', onPress: onClose }]
        );
      } else {
        Alert.alert(
          'Erro',
          `Não foi possível compartilhar via ${platform}. Tente novamente.`
        );
      }
    } catch (error) {
      Alert.alert(
        'Erro',
        'Ocorreu um erro ao compartilhar. Verifique se o aplicativo está instalado.'
      );
    } finally {
      setIsSharing(false);
    }
  };

  const shareOptions: ShareOption[] = [
    {
      id: 'whatsapp',
      name: 'WhatsApp',
      icon: 'logo-whatsapp',
      color: '#25D366',
      action: () => ShareService.shareViaWhatsApp(violationData),
    },
    {
      id: 'facebook',
      name: 'Facebook',
      icon: 'logo-facebook',
      color: '#1877F2',
      action: () => ShareService.shareViaFacebook(violationData),
    },
    {
      id: 'twitter',
      name: 'Twitter',
      icon: 'logo-twitter',
      color: '#1DA1F2',
      action: () => ShareService.shareViaTwitter(violationData),
    },
    {
      id: 'instagram',
      name: 'Instagram',
      icon: 'logo-instagram',
      color: '#E4405F',
      action: () => ShareService.shareViaInstagram(violationData),
    },
    {
      id: 'email',
      name: 'Email',
      icon: 'mail',
      color: '#EA4335',
      action: () => ShareService.shareViaEmail(violationData),
    },
    {
      id: 'copy',
      name: 'Copiar Link',
      icon: 'copy',
      color: '#6B7280',
      action: async () => {
        const success = await ShareService.copyLink(violationData.id);
        if (success) {
          Alert.alert('Link Copiado!', 'O link foi copiado para a área de transferência.', [
            { text: 'OK', onPress: onClose }
          ]);
        }
        return success;
      },
    },
    {
      id: 'more',
      name: 'Mais',
      icon: 'share-social',
      color: '#8B5CF6',
      action: () => ShareService.shareViaSystem(violationData),
    },
  ];

  const renderShareButton = (option: ShareOption) => (
    <TouchableOpacity
      key={option.id}
      style={[
        styles.shareButton,
        { backgroundColor: theme === 'dark' ? Colors.dark.card : Colors.light.card },
      ]}
      onPress={() => handleShare(option.name, option.action)}
      disabled={isSharing}
    >
      <View style={[styles.iconContainer, { backgroundColor: option.color }]}>
        <Ionicons name={option.icon} size={28} color="#FFFFFF" />
      </View>
      <Text
        style={[
          styles.shareButtonText,
          { color: theme === 'dark' ? Colors.dark.text : Colors.light.text },
        ]}
        numberOfLines={1}
      >
        {option.name}
      </Text>
    </TouchableOpacity>
  );

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={onClose}
        />
        
        <View
          style={[
            styles.modalContainer,
            {
              backgroundColor:
                theme === 'dark' ? Colors.dark.background : Colors.light.background,
            },
          ]}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text
              style={[
                styles.title,
                { color: theme === 'dark' ? Colors.dark.text : Colors.light.text },
              ]}
            >
              Compartilhar Denúncia
            </Text>
            <TouchableOpacity
              onPress={onClose}
              style={styles.closeButton}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons
                name="close"
                size={28}
                color={theme === 'dark' ? Colors.dark.text : Colors.light.text}
              />
            </TouchableOpacity>
          </View>

          {/* Divider */}
          <View
            style={[
              styles.divider,
              {
                backgroundColor:
                  theme === 'dark' ? Colors.dark.border : Colors.light.border,
              },
            ]}
          />

          {/* Share Options Grid */}
          <View style={styles.optionsContainer}>
            <View style={styles.optionsGrid}>
              {shareOptions.map(renderShareButton)}
            </View>
          </View>

          {/* Info Text */}
          <Text
            style={[
              styles.infoText,
              {
                color:
                  theme === 'dark'
                    ? Colors.dark.textSecondary
                    : Colors.light.textSecondary,
              },
            ]}
          >
            📢 Ajude a tornar o trânsito mais seguro compartilhando esta denúncia!
          </Text>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: Platform.OS === 'ios' ? 34 : 24,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 16,
      },
    }),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  closeButton: {
    padding: 4,
  },
  divider: {
    height: 1,
    marginHorizontal: 20,
  },
  optionsContainer: {
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 16,
  },
  shareButton: {
    width: '30%',
    minWidth: 100,
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  shareButtonText: {
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
    letterSpacing: 0.2,
  },
  infoText: {
    fontSize: 13,
    textAlign: 'center',
    paddingHorizontal: 32,
    paddingTop: 8,
    lineHeight: 18,
  },
});
