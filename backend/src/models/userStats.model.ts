import mongoose, { Document, Schema } from 'mongoose';

export interface IUserStats extends Document {
  userId: mongoose.Types.ObjectId;
  points: number;
  level: number;
  badges: string[];
  achievements: {
    id: string;
    name: string;
    unlockedAt: Date;
  }[];
  stats: {
    totalViolations: number;
    approvedViolations: number;
    rejectedViolations: number;
    sharedViolations: number;
    streak: number; // Dias consecutivos com denúncias
    lastViolationDate: Date | null;
  };
  ranking: {
    position: number;
    updatedAt: Date;
  };
  createdAt: Date;
  updatedAt: Date;
}

const userStatsSchema = new Schema<IUserStats>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true,
    },
    points: {
      type: Number,
      default: 0,
      min: 0,
    },
    level: {
      type: Number,
      default: 1,
      min: 1,
    },
    badges: [{
      type: String,
    }],
    achievements: [{
      id: String,
      name: String,
      unlockedAt: Date,
    }],
    stats: {
      totalViolations: { type: Number, default: 0 },
      approvedViolations: { type: Number, default: 0 },
      rejectedViolations: { type: Number, default: 0 },
      sharedViolations: { type: Number, default: 0 },
      streak: { type: Number, default: 0 },
      lastViolationDate: { type: Date, default: null },
    },
    ranking: {
      position: { type: Number, default: 0 },
      updatedAt: { type: Date, default: Date.now },
    },
  },
  {
    timestamps: true,
  }
);

// Índices para ranking
userStatsSchema.index({ points: -1 });
userStatsSchema.index({ level: -1 });

export const UserStats = mongoose.model<IUserStats>('UserStats', userStatsSchema);
