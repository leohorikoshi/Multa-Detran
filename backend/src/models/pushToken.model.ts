import mongoose, { Document, Schema } from 'mongoose';

export interface IPushToken extends Document {
  userId: mongoose.Types.ObjectId;
  token: string;
  platform: 'ios' | 'android' | 'web';
  deviceId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const pushTokenSchema = new Schema<IPushToken>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    token: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    platform: {
      type: String,
      enum: ['ios', 'android', 'web'],
      required: true,
    },
    deviceId: {
      type: String,
      sparse: true,
    },
  },
  {
    timestamps: true,
  }
);

// Índice composto para buscar tokens por usuário
pushTokenSchema.index({ userId: 1, platform: 1 });

// Remover tokens duplicados para o mesmo usuário/device
pushTokenSchema.index({ userId: 1, deviceId: 1 }, { unique: true, sparse: true });

export const PushToken = mongoose.model<IPushToken>('PushToken', pushTokenSchema);
