import { Response, Request } from 'express';
import * as NotificationService from '../services/notification.service';
import { PushToken } from '../models/pushToken.model';

// Extend Express Request type to include user
interface AuthRequest extends Request {
  user?: {
    id: string;
    _id: string;
    role: string;
    name: string;
    email: string;
  };
}

/**
 * POST /api/notifications/register-token
 * Registra um token de push notification para o usuário
 */
export const registerPushToken = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { token, platform, deviceId } = req.body;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: 'Usuário não autenticado',
      });
      return;
    }

    if (!token || !platform) {
      res.status(400).json({
        success: false,
        message: 'Token e plataforma são obrigatórios',
      });
      return;
    }

    if (!['ios', 'android', 'web'].includes(platform)) {
      res.status(400).json({
        success: false,
        message: 'Plataforma inválida. Use: ios, android ou web',
      });
      return;
    }

    const result = await NotificationService.registerPushToken(
      userId,
      token,
      platform,
      deviceId
    );

    res.status(result.success ? 200 : 400).json({
      success: result.success,
      message: result.message,
    });
  } catch (error: any) {
    console.error('Erro ao registrar token:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao registrar token de notificação',
      error: error.message,
    });
  }
};

/**
 * POST /api/notifications/unregister-token
 * Remove um token de push notification
 */
export const unregisterPushToken = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { token } = req.body;

    if (!token) {
      res.status(400).json({
        success: false,
        message: 'Token é obrigatório',
      });
      return;
    }

    const result = await NotificationService.unregisterPushToken(token);

    res.status(result.success ? 200 : 404).json({
      success: result.success,
      message: result.message,
    });
  } catch (error: any) {
    console.error('Erro ao remover token:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao remover token de notificação',
      error: error.message,
    });
  }
};

/**
 * GET /api/notifications/tokens
 * Lista todos os tokens do usuário autenticado
 */
export const getUserTokens = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: 'Usuário não autenticado',
      });
      return;
    }

    const tokens = await PushToken.find({ userId }).select('-__v');

    res.status(200).json({
      success: true,
      data: {
        tokens,
        count: tokens.length,
      },
    });
  } catch (error: any) {
    console.error('Erro ao buscar tokens:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar tokens',
      error: error.message,
    });
  }
};

/**
 * POST /api/notifications/send-test
 * Envia notificação de teste (apenas para desenvolvimento)
 */
export const sendTestNotification = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: 'Usuário não autenticado',
      });
      return;
    }

    // Apenas em desenvolvimento
    if (process.env.NODE_ENV === 'production') {
      res.status(403).json({
        success: false,
        message: 'Endpoint disponível apenas em desenvolvimento',
      });
      return;
    }

    const { title, body } = req.body;

    const result = await NotificationService.sendPushNotification(userId, {
      title: title || '🔔 Notificação de Teste',
      body: body || 'Esta é uma notificação de teste do DetranDenuncia!',
      data: { type: 'test' },
    });

    res.status(result.success ? 200 : 400).json(result);
  } catch (error: any) {
    console.error('Erro ao enviar notificação de teste:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao enviar notificação de teste',
      error: error.message,
    });
  }
};

/**
 * DELETE /api/notifications/tokens/:tokenId
 * Remove um token específico
 */
export const deleteToken = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { tokenId } = req.params;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: 'Usuário não autenticado',
      });
      return;
    }

    // Verificar se o token pertence ao usuário
    const token = await PushToken.findOne({ _id: tokenId, userId });

    if (!token) {
      res.status(404).json({
        success: false,
        message: 'Token não encontrado ou não pertence ao usuário',
      });
      return;
    }

    await PushToken.deleteOne({ _id: tokenId });

    res.status(200).json({
      success: true,
      message: 'Token removido com sucesso',
    });
  } catch (error: any) {
    console.error('Erro ao deletar token:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao deletar token',
      error: error.message,
    });
  }
};
