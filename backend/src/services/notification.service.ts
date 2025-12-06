import { Expo, ExpoPushMessage, ExpoPushTicket, ExpoPushErrorReceipt } from 'expo-server-sdk';
import { PushToken } from '../models/pushToken.model';
import mongoose from 'mongoose';

// Criar instância do Expo SDK
const expo = new Expo({
  accessToken: process.env.EXPO_ACCESS_TOKEN,
  useFcmV1: true, // Usar FCM v1 API (recomendado)
});

interface NotificationPayload {
  title: string;
  body: string;
  data?: Record<string, any>;
  sound?: 'default' | null;
  badge?: number;
  channelId?: string;
  priority?: 'default' | 'normal' | 'high';
}

/**
 * Envia notificação push para um usuário específico
 */
export const sendPushNotification = async (
  userId: string | mongoose.Types.ObjectId,
  payload: NotificationPayload
): Promise<{ success: boolean; message: string; errors?: string[] }> => {
  try {
    // Buscar todos os tokens do usuário
    const pushTokens = await PushToken.find({ userId });

    if (pushTokens.length === 0) {
      return {
        success: false,
        message: 'Nenhum token de push encontrado para este usuário',
      };
    }

    // Filtrar apenas tokens válidos do Expo
    const validTokens = pushTokens
      .map((pt) => pt.token)
      .filter((token) => Expo.isExpoPushToken(token));

    if (validTokens.length === 0) {
      return {
        success: false,
        message: 'Nenhum token válido do Expo encontrado',
      };
    }

    // Criar mensagens para cada token
    const messages: ExpoPushMessage[] = validTokens.map((token) => ({
      to: token,
      sound: payload.sound || 'default',
      title: payload.title,
      body: payload.body,
      data: payload.data || {},
      badge: payload.badge,
      channelId: payload.channelId || 'default',
      priority: payload.priority || 'high',
    }));

    // Enviar notificações em chunks (Expo recomenda chunks de 100)
    const chunks = expo.chunkPushNotifications(messages);
    const tickets: ExpoPushTicket[] = [];
    const errors: string[] = [];

    for (const chunk of chunks) {
      try {
        const ticketChunk = await expo.sendPushNotificationsAsync(chunk);
        tickets.push(...ticketChunk);
      } catch (error: any) {
        console.error('Erro ao enviar chunk de notificações:', error);
        errors.push(error.message);
      }
    }

    // Verificar tickets para erros
    for (let i = 0; i < tickets.length; i++) {
      const ticket = tickets[i];
      if (ticket.status === 'error') {
        console.error(`Erro no ticket ${i}:`, ticket.message);
        errors.push(`Token ${i}: ${ticket.message}`);

        // Se o token for inválido, removê-lo do banco
        if (
          ticket.details?.error === 'DeviceNotRegistered' ||
          ticket.message?.includes('not registered')
        ) {
          await PushToken.deleteOne({ token: validTokens[i] });
          console.log(`Token inválido removido: ${validTokens[i]}`);
        }
      }
    }

    return {
      success: tickets.some((t) => t.status === 'ok'),
      message: `Notificação enviada para ${tickets.filter((t) => t.status === 'ok').length}/${tickets.length} dispositivos`,
      errors: errors.length > 0 ? errors : undefined,
    };
  } catch (error: any) {
    console.error('Erro ao enviar notificação push:', error);
    return {
      success: false,
      message: 'Erro ao enviar notificação',
      errors: [error.message],
    };
  }
};

/**
 * Envia notificações push para múltiplos usuários
 */
export const sendBulkNotifications = async (
  userIds: (string | mongoose.Types.ObjectId)[],
  payload: NotificationPayload
): Promise<{ success: boolean; message: string; stats: { sent: number; failed: number } }> => {
  try {
    const results = await Promise.allSettled(
      userIds.map((userId) => sendPushNotification(userId, payload))
    );

    const stats = {
      sent: results.filter((r) => r.status === 'fulfilled' && r.value.success).length,
      failed: results.filter((r) => r.status === 'rejected' || !r.value.success).length,
    };

    return {
      success: stats.sent > 0,
      message: `Notificações enviadas: ${stats.sent} sucesso, ${stats.failed} falhas`,
      stats,
    };
  } catch (error: any) {
    console.error('Erro ao enviar notificações em massa:', error);
    return {
      success: false,
      message: 'Erro ao enviar notificações em massa',
      stats: { sent: 0, failed: userIds.length },
    };
  }
};

/**
 * Agenda notificação para envio futuro (usando setTimeout - para produção usar queue como Bull)
 */
export const scheduleNotification = (
  userId: string | mongoose.Types.ObjectId,
  timestamp: Date,
  payload: NotificationPayload
): { success: boolean; message: string; scheduledFor: Date } => {
  try {
    const delay = timestamp.getTime() - Date.now();

    if (delay <= 0) {
      throw new Error('Timestamp deve ser no futuro');
    }

    setTimeout(async () => {
      await sendPushNotification(userId, payload);
      console.log(`Notificação agendada enviada para userId: ${userId}`);
    }, delay);

    return {
      success: true,
      message: 'Notificação agendada com sucesso',
      scheduledFor: timestamp,
    };
  } catch (error: any) {
    console.error('Erro ao agendar notificação:', error);
    return {
      success: false,
      message: error.message,
      scheduledFor: timestamp,
    };
  }
};

/**
 * Registra um novo token de push
 */
export const registerPushToken = async (
  userId: string | mongoose.Types.ObjectId,
  token: string,
  platform: 'ios' | 'android' | 'web',
  deviceId?: string
): Promise<{ success: boolean; message: string }> => {
  try {
    // Validar se é um token Expo válido
    if (!Expo.isExpoPushToken(token)) {
      return {
        success: false,
        message: 'Token de push inválido',
      };
    }

    // Verificar se token já existe
    const existingToken = await PushToken.findOne({ token });

    if (existingToken) {
      // Atualizar userId se mudou
      if (existingToken.userId.toString() !== userId.toString()) {
        existingToken.userId = userId as mongoose.Types.ObjectId;
        existingToken.platform = platform;
        existingToken.deviceId = deviceId;
        await existingToken.save();
        return {
          success: true,
          message: 'Token atualizado para novo usuário',
        };
      }
      return {
        success: true,
        message: 'Token já registrado',
      };
    }

    // Criar novo token
    await PushToken.create({
      userId,
      token,
      platform,
      deviceId,
    });

    return {
      success: true,
      message: 'Token registrado com sucesso',
    };
  } catch (error: any) {
    console.error('Erro ao registrar token:', error);
    return {
      success: false,
      message: error.message,
    };
  }
};

/**
 * Remove um token de push
 */
export const unregisterPushToken = async (
  token: string
): Promise<{ success: boolean; message: string }> => {
  try {
    const result = await PushToken.deleteOne({ token });

    if (result.deletedCount === 0) {
      return {
        success: false,
        message: 'Token não encontrado',
      };
    }

    return {
      success: true,
      message: 'Token removido com sucesso',
    };
  } catch (error: any) {
    console.error('Erro ao remover token:', error);
    return {
      success: false,
      message: error.message,
    };
  }
};

/**
 * Notificações pré-definidas para diferentes eventos
 */
export const NotificationTemplates = {
  violationApproved: (violationType: string): NotificationPayload => ({
    title: '✅ Denúncia Aprovada!',
    body: `Sua denúncia de ${violationType} foi aprovada e está sendo processada.`,
    data: { type: 'violation_approved' },
    sound: 'default',
    badge: 1,
    channelId: 'violations',
    priority: 'high',
  }),

  violationRejected: (violationType: string, reason?: string): NotificationPayload => ({
    title: '❌ Denúncia Rejeitada',
    body: reason
      ? `Sua denúncia de ${violationType} foi rejeitada: ${reason}`
      : `Sua denúncia de ${violationType} foi rejeitada. Verifique os detalhes no app.`,
    data: { type: 'violation_rejected' },
    sound: 'default',
    badge: 1,
    channelId: 'violations',
    priority: 'high',
  }),

  violationUnderReview: (violationType: string): NotificationPayload => ({
    title: '🔍 Denúncia em Análise',
    body: `Sua denúncia de ${violationType} está sendo analisada por nossa equipe.`,
    data: { type: 'violation_reviewing' },
    sound: 'default',
    badge: 1,
    channelId: 'violations',
    priority: 'normal',
  }),

  newViolationNearby: (violationType: string, distance: number): NotificationPayload => ({
    title: '📍 Nova Denúncia Próxima',
    body: `Uma nova denúncia de ${violationType} foi reportada a ${distance}m de você.`,
    data: { type: 'violation_nearby' },
    sound: 'default',
    channelId: 'nearby',
    priority: 'normal',
  }),

  welcomeNotification: (userName: string): NotificationPayload => ({
    title: '🎉 Bem-vindo ao DetranDenuncia!',
    body: `Olá ${userName}! Obrigado por fazer parte da nossa comunidade. Juntos tornamos o trânsito mais seguro!`,
    data: { type: 'welcome' },
    sound: 'default',
    channelId: 'general',
    priority: 'normal',
  }),
};
