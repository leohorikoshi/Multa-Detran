import { UserStats } from '../models/userStats.model';
import mongoose from 'mongoose';

// Constantes de gamificação
export const POINTS = {
  VIOLATION_CREATED: 10,
  VIOLATION_APPROVED: 50,
  VIOLATION_SHARED: 5,
  DAILY_STREAK: 20,
};

export const BADGES = {
  FIRST_VIOLATION: { id: 'first_violation', name: 'Primeira Denúncia', icon: '🎯' },
  HELPER: { id: 'helper', name: 'Ajudante', icon: '🤝', requirement: 10 },
  GUARDIAN: { id: 'guardian', name: 'Guardião', icon: '🛡️', requirement: 50 },
  HERO: { id: 'hero', name: 'Herói', icon: '🦸', requirement: 100 },
  LEGEND: { id: 'legend', name: 'Lenda', icon: '👑', requirement: 500 },
  SHARER: { id: 'sharer', name: 'Compartilhador', icon: '📢', requirement: 20 },
  STREAK_7: { id: 'streak_7', name: 'Semana Ativa', icon: '🔥', requirement: 7 },
  STREAK_30: { id: 'streak_30', name: 'Mês Ativo', icon: '⚡', requirement: 30 },
};

// Calcular nível baseado em pontos
export const calculateLevel = (points: number): number => {
  return Math.floor(Math.sqrt(points / 100)) + 1;
};

// Obter ou criar stats do usuário
export const getUserStats = async (userId: string | mongoose.Types.ObjectId) => {
  let stats = await UserStats.findOne({ userId });
  
  if (!stats) {
    stats = await UserStats.create({
      userId,
      points: 0,
      level: 1,
      badges: [],
      achievements: [],
      stats: {
        totalViolations: 0,
        approvedViolations: 0,
        rejectedViolations: 0,
        sharedViolations: 0,
        streak: 0,
        lastViolationDate: null,
      },
      ranking: {
        position: 0,
        updatedAt: new Date(),
      },
    });
  }
  
  return stats;
};

// Adicionar pontos
export const addPoints = async (userId: string | mongoose.Types.ObjectId, points: number, reason: string) => {
  const stats = await getUserStats(userId);
  stats.points += points;
  stats.level = calculateLevel(stats.points);
  
  // Verificar novos badges
  await checkBadges(stats);
  
  await stats.save();
  
  return {
    newPoints: stats.points,
    newLevel: stats.level,
    pointsAdded: points,
    reason,
  };
};

// Verificar e adicionar badges
const checkBadges = async (stats: any) => {
  const totalViolations = stats.stats.totalViolations;
  const sharedViolations = stats.stats.sharedViolations;
  const streak = stats.stats.streak;
  
  const newBadges: string[] = [];
  
  // Badge de primeira denúncia
  if (totalViolations >= 1 && !stats.badges.includes(BADGES.FIRST_VIOLATION.id)) {
    newBadges.push(BADGES.FIRST_VIOLATION.id);
  }
  
  // Badges por quantidade
  if (totalViolations >= BADGES.HELPER.requirement && !stats.badges.includes(BADGES.HELPER.id)) {
    newBadges.push(BADGES.HELPER.id);
  }
  if (totalViolations >= BADGES.GUARDIAN.requirement && !stats.badges.includes(BADGES.GUARDIAN.id)) {
    newBadges.push(BADGES.GUARDIAN.id);
  }
  if (totalViolations >= BADGES.HERO.requirement && !stats.badges.includes(BADGES.HERO.id)) {
    newBadges.push(BADGES.HERO.id);
  }
  if (totalViolations >= BADGES.LEGEND.requirement && !stats.badges.includes(BADGES.LEGEND.id)) {
    newBadges.push(BADGES.LEGEND.id);
  }
  
  // Badge de compartilhamento
  if (sharedViolations >= BADGES.SHARER.requirement && !stats.badges.includes(BADGES.SHARER.id)) {
    newBadges.push(BADGES.SHARER.id);
  }
  
  // Badges de streak
  if (streak >= BADGES.STREAK_7.requirement && !stats.badges.includes(BADGES.STREAK_7.id)) {
    newBadges.push(BADGES.STREAK_7.id);
  }
  if (streak >= BADGES.STREAK_30.requirement && !stats.badges.includes(BADGES.STREAK_30.id)) {
    newBadges.push(BADGES.STREAK_30.id);
  }
  
  // Adicionar novos badges
  if (newBadges.length > 0) {
    stats.badges.push(...newBadges);
    newBadges.forEach(badgeId => {
      const badge = Object.values(BADGES).find(b => b.id === badgeId);
      if (badge) {
        stats.achievements.push({
          id: badgeId,
          name: badge.name,
          unlockedAt: new Date(),
        });
      }
    });
  }
  
  return newBadges;
};

// Atualizar estatísticas ao criar denúncia
export const onViolationCreated = async (userId: string | mongoose.Types.ObjectId) => {
  const stats = await getUserStats(userId);
  stats.stats.totalViolations += 1;
  
  // Verificar streak
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  if (stats.stats.lastViolationDate) {
    const lastDate = new Date(stats.stats.lastViolationDate);
    lastDate.setHours(0, 0, 0, 0);
    
    const diffDays = Math.floor((today.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) {
      stats.stats.streak += 1;
      await addPoints(userId, POINTS.DAILY_STREAK, 'Streak diário');
    } else if (diffDays > 1) {
      stats.stats.streak = 1;
    }
  } else {
    stats.stats.streak = 1;
  }
  
  stats.stats.lastViolationDate = new Date();
  await stats.save();
  
  return addPoints(userId, POINTS.VIOLATION_CREATED, 'Denúncia criada');
};

// Atualizar ao aprovar denúncia
export const onViolationApproved = async (userId: string | mongoose.Types.ObjectId) => {
  const stats = await getUserStats(userId);
  stats.stats.approvedViolations += 1;
  await stats.save();
  
  return addPoints(userId, POINTS.VIOLATION_APPROVED, 'Denúncia aprovada');
};

// Atualizar ao rejeitar denúncia
export const onViolationRejected = async (userId: string | mongoose.Types.ObjectId) => {
  const stats = await getUserStats(userId);
  stats.stats.rejectedViolations += 1;
  await stats.save();
};

// Atualizar ao compartilhar
export const onViolationShared = async (userId: string | mongoose.Types.ObjectId) => {
  const stats = await getUserStats(userId);
  stats.stats.sharedViolations += 1;
  await stats.save();
  
  return addPoints(userId, POINTS.VIOLATION_SHARED, 'Denúncia compartilhada');
};

// Obter ranking
export const getLeaderboard = async (limit: number = 10) => {
  const leaderboard = await UserStats.find()
    .sort({ points: -1 })
    .limit(limit)
    .populate('userId', 'name email')
    .select('userId points level badges stats');
  
  return leaderboard;
};

// Atualizar posição no ranking
export const updateRanking = async () => {
  const allStats = await UserStats.find().sort({ points: -1 });
  
  for (let i = 0; i < allStats.length; i++) {
    allStats[i].ranking.position = i + 1;
    allStats[i].ranking.updatedAt = new Date();
    await allStats[i].save();
  }
};
