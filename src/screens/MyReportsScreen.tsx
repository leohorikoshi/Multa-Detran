import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { VIOLATION_STATUS } from '../constants';
import { ShareModal } from '../components/share/ShareModal';
import type { ShareViolationData } from '../utils/shareService';
import { useTheme } from '../contexts/ThemeContext';

type MyReportsScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'MyReports'>;
};

// Tipo temporário para exemplo
type Report = {
  id: string;
  violationType: string;
  status: keyof typeof VIOLATION_STATUS;
  createdAt: string;
  images: string[];
  location?: string;
};

export const MyReportsScreen: React.FC<MyReportsScreenProps> = ({ navigation }) => {
  const { colors } = useTheme();
  const [shareModalVisible, setShareModalVisible] = useState(false);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);

  // TODO: Substituir por dados reais da API
  const mockReports: Report[] = [
    {
      id: '1',
      violationType: 'Estacionamento irregular',
      status: 'pending',
      createdAt: '2025-11-08T10:00:00',
      images: ['https://picsum.photos/200'],
      location: 'Av. Paulista, 1000 - São Paulo/SP',
    },
    {
      id: '2',
      violationType: 'Avanço de sinal vermelho',
      status: 'reviewing',
      createdAt: '2025-11-07T15:30:00',
      images: ['https://picsum.photos/200'],
      location: 'Rua Augusta, 500 - São Paulo/SP',
    },
  ];

  const handleShare = (item: Report) => {
    setSelectedReport(item);
    setShareModalVisible(true);
  };

  const renderItem = ({ item }: { item: Report }) => (
    <TouchableOpacity style={[styles.reportCard, { backgroundColor: colors.surface }]}>
      <View style={styles.reportHeader}>
        <Text style={[styles.reportType, { color: colors.text }]}>{item.violationType}</Text>
        <View style={styles.headerActions}>
          <Text style={[
            styles.statusBadge,
            { backgroundColor: getStatusColor(item.status) }
          ]}>
            {VIOLATION_STATUS[item.status]}
          </Text>
          <TouchableOpacity
            onPress={() => handleShare(item)}
            style={styles.shareIconButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Text style={styles.shareIcon}>📤</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.imageRow}>
        {item.images.map((uri, index) => (
          <Image
            key={index}
            source={{ uri }}
            style={styles.thumbnail}
          />
        ))}
      </View>

      <Text style={[styles.date, { color: colors.textSecondary }]}>
        {new Date(item.createdAt).toLocaleDateString('pt-BR')}
      </Text>
    </TouchableOpacity>
  );

  const getStatusColor = (status: keyof typeof VIOLATION_STATUS) => {
    switch (status) {
      case 'pending':
        return colors.warning;
      case 'reviewing':
        return colors.info;
      case 'approved':
        return colors.success;
      case 'rejected':
        return colors.error;
      default:
        return colors.textTertiary;
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.primary }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={[styles.backButtonText, { color: colors.textInverse }]}>← Voltar</Text>
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.textInverse }]}>Minhas Denúncias</Text>
      </View>

      <FlatList
        data={mockReports}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
      />

      {selectedReport && (
        <ShareModal
          visible={shareModalVisible}
          onClose={() => setShareModalVisible(false)}
          violationData={{
            id: selectedReport.id,
            type: selectedReport.violationType,
            location: selectedReport.location || 'Local não informado',
            date: selectedReport.createdAt,
            imageUrl: selectedReport.images[0] || '',
          }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
  },
  backButton: {
    marginBottom: 5,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  list: {
    padding: 20,
  },
  reportCard: {
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  reportHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  shareIconButton: {
    padding: 4,
  },
  shareIcon: {
    fontSize: 20,
  },
  reportType: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
    fontSize: 12,
    color: '#fff',
  },
  imageRow: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  thumbnail: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 10,
  },
  date: {
    fontSize: 12,
    textAlign: 'right',
  },
});