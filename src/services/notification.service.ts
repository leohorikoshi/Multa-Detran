import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import Constants from 'expo-constants';
import api from '../utils/api';

// Configurar comportamento de notificações
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

/**
 * Registra o token de push notification
 */
export const registerForPushNotifications = async (): Promise<string | null> => {
  try {
    // Verificar se é dispositivo físico
    if (!Device.isDevice) {
      console.log('Push notifications funcionam apenas em dispositivos físicos');
      return null;
    }

    // Solicitar permissão
    const existingPermissions: any = await Notifications.getPermissionsAsync();
    let finalStatus = existingPermissions.status === 'granted';

    if (existingPermissions.status !== 'granted') {
      const newPermissions: any = await Notifications.requestPermissionsAsync();
      finalStatus = newPermissions.status === 'granted';
    }

    if (!finalStatus) {
      console.log('Permissão de notificação negada');
      return null;
    }

    // Obter token Expo Push
    const projectId = Constants.expoConfig?.extra?.eas?.projectId ?? Constants.easConfig?.projectId;
    
    const tokenData = await Notifications.getExpoPushTokenAsync({
      projectId,
    });

    const token = tokenData.data;

    // Configurar canal de notificação (Android)
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'DetranDenuncia',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#1E88E5',
      });

      await Notifications.setNotificationChannelAsync('violations', {
        name: 'Denúncias',
        importance: Notifications.AndroidImportance.HIGH,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF6F00',
      });
    }

    // Registrar token no backend
    await api.post('/notifications/register-token', {
      token,
      platform: Platform.OS,
      deviceId: Device.modelName,
    });

    console.log('✅ Push token registrado:', token);
    return token;
  } catch (error) {
    console.error('Erro ao registrar push notification:', error);
    return null;
  }
};

/**
 * Remove o token de push notification
 */
export const unregisterPushNotifications = async (token: string): Promise<void> => {
  try {
    await api.post('/notifications/unregister-token', { token });
    console.log('✅ Push token removido');
  } catch (error) {
    console.error('Erro ao remover push token:', error);
  }
};

/**
 * Adiciona listener para notificações recebidas
 */
export const addNotificationReceivedListener = (
  callback: (notification: Notifications.Notification) => void
) => {
  return Notifications.addNotificationReceivedListener(callback);
};

/**
 * Adiciona listener para quando usuário toca na notificação
 */
export const addNotificationResponseListener = (
  callback: (response: Notifications.NotificationResponse) => void
) => {
  return Notifications.addNotificationResponseReceivedListener(callback);
};

/**
 * Envia notificação local de teste
 */
export const sendLocalNotification = async (title: string, body: string): Promise<void> => {
  await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      data: { type: 'local' },
    },
    trigger: null, // Enviar imediatamente
  });
};

/**
 * Cancela todas as notificações
 */
export const cancelAllNotifications = async (): Promise<void> => {
  await Notifications.cancelAllScheduledNotificationsAsync();
};

/**
 * Obtém badge count
 */
export const getBadgeCount = async (): Promise<number> => {
  return await Notifications.getBadgeCountAsync();
};

/**
 * Define badge count
 */
export const setBadgeCount = async (count: number): Promise<void> => {
  await Notifications.setBadgeCountAsync(count);
};
