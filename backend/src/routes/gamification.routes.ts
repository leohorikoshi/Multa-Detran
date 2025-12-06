import { Router } from 'express';
import * as gamificationController from '../controllers/gamification.controller';
import { protect } from '../middleware/auth.middleware';

const router = Router();

router.use(protect);

router.get('/stats', gamificationController.getUserStats);
router.get('/leaderboard', gamificationController.getLeaderboard);
router.post('/share', gamificationController.recordShare);

export default router;
