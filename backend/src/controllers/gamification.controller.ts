import { Response, Request } from 'express';
import * as GamificationService from '../services/gamification.service';

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

// GET /api/gamification/stats
export const getUserStats = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ success: false, message: 'Não autenticado' });
      return;
    }

    const stats = await GamificationService.getUserStats(userId);
    res.status(200).json({ success: true, data: stats });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/gamification/leaderboard
export const getLeaderboard = async (req: Request, res: Response): Promise<void> => {
  try {
    const limit = parseInt(req.query.limit as string) || 10;
    const leaderboard = await GamificationService.getLeaderboard(limit);
    res.status(200).json({ success: true, data: leaderboard });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/gamification/share
export const recordShare = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ success: false, message: 'Não autenticado' });
      return;
    }

    const result = await GamificationService.onViolationShared(userId);
    res.status(200).json({ success: true, data: result });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
