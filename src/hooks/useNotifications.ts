import { useEffect, useRef, useState } from 'react';
import * as Notifications from 'expo-notifications';
import { useNavigation } from '@react-navigation/native';
import * as NotificationService from '../services/notification.service';

export const useNotifications = () => {
  const [expoPushToken, setExpoPushToken] = useState<string | null>(null);
  const [notification, setNotification] = useState<Notifications.Notification | null>(null);
  const notificationListener = useRef<any>();
  const responseListener = useRef<any>();
  const navigation = useNavigation<any>();

  useEffect(() => {
    // Registrar para push notifications
    NotificationService.registerForPushNotifications()
      .then((token) => setExpoPushToken(token))
      .catch((error) => console.error('Erro ao registrar notificações:', error));

    // Listener para notificações recebidas (app em foreground)
    notificationListener.current = NotificationService.addNotificationReceivedListener(
      (notification) => {
        console.log('🔔 Notificação recebida:', notification);
        setNotification(notification);
      }
    );

    // Listener para quando usuário toca na notificação
    responseListener.current = NotificationService.addNotificationResponseListener(
      (response) => {
        console.log('👆 Usuário tocou na notificação:', response);
        
        const data = response.notification.request.content.data;
        
        // Navegar baseado no tipo de notificação
        if (data.type === 'violation_approved' || data.type === 'violation_rejected') {
          if (data.violationId) {
            navigation.navigate('ViolationDetails', { violationId: data.violationId });
          }
        }
      }
    );

    // Cleanup
    return () => {
      if (notificationListener.current) {
        notificationListener.current.remove();
      }
      if (responseListener.current) {
        responseListener.current.remove();
      }
    };
  }, [navigation]);

  return {
    expoPushToken,
    notification,
  };
};
