import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { VIOLATION_STATUS } from '../constants';
import { ShareModal } from '../components/share/ShareModal';
import type { ShareViolationData } from '../utils/shareService';

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
    <TouchableOpacity style={styles.reportCard}>
      <View style={styles.reportHeader}>
        <Text style={styles.reportType}>{item.violationType}</Text>
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
            <Ionicons name="share-social-outline" size={20} color="#1a73e8" />
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

      <Text style={styles.date}>
        {new Date(item.createdAt).toLocaleDateString('pt-BR')}
      </Text>
    </TouchableOpacity>
  );

  const getStatusColor = (status: keyof typeof VIOLATION_STATUS) => {
    switch (status) {
      case 'pending':
        return '#ffa726';
      case 'reviewing':
        return '#29b6f6';
      case 'approved':
        return '#66bb6a';
      case 'rejected':
        return '#ef5350';
      default:
        return '#999';
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Minhas Denúncias</Text>
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
    backgroundColor: '#fff',
  },
  header: {
    padding: 20,
    backgroundColor: '#1a73e8',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  list: {
    padding: 20,
  },
  reportCard: {
    backgroundColor: '#fff',
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
  reportType: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
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
    color: '#666',
    textAlign: 'right',
  },
});