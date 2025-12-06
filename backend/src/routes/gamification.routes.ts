import { Router } from 'express';
import * as gamificationController from '../controllers/gamification.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticateToken);

router.get('/stats', gamificationController.getUserStats);
router.get('/leaderboard', gamificationController.getLeaderboard);
router.post('/share', gamificationController.recordShare);

export default router;
