import { Router } from 'express';
import * as notificationController from '../controllers/notification.controller';
import { protect } from '../middleware/auth.middleware';

const router = Router();

// Todas as rotas de notificação requerem autenticação
router.use(protect);

/**
 * @route   POST /api/notifications/register-token
 * @desc    Registra token de push notification
 * @access  Private
 */
router.post('/register-token', notificationController.registerPushToken);

/**
 * @route   POST /api/notifications/unregister-token
 * @desc    Remove token de push notification
 * @access  Private
 */
router.post('/unregister-token', notificationController.unregisterPushToken);

/**
 * @route   GET /api/notifications/tokens
 * @desc    Lista todos os tokens do usuário
 * @access  Private
 */
router.get('/tokens', notificationController.getUserTokens);

/**
 * @route   DELETE /api/notifications/tokens/:tokenId
 * @desc    Remove um token específico
 * @access  Private
 */
router.delete('/tokens/:tokenId', notificationController.deleteToken);

/**
 * @route   POST /api/notifications/send-test
 * @desc    Envia notificação de teste (apenas dev)
 * @access  Private
 */
router.post('/send-test', notificationController.sendTestNotification);

export default router;
