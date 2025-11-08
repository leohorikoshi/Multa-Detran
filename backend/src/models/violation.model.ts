import mongoose, { Document, Schema } from 'mongoose';

export interface IViolation extends Document {
  user: mongoose.Types.ObjectId;
  violationType: string;
  description: string;
  location: {
    type: string;
    coordinates: number[];
    address?: string;
  };
  images: string[];
  plateNumber?: string;
  status: 'pending' | 'reviewing' | 'approved' | 'rejected';
  reviewedBy?: mongoose.Types.ObjectId;
  reviewNotes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const violationSchema = new Schema<IViolation>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Usuário é obrigatório'],
    },
    violationType: {
      type: String,
      required: [true, 'Tipo de infração é obrigatório'],
    },
    description: {
      type: String,
      required: [true, 'Descrição é obrigatória'],
    },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
      },
      coordinates: {
        type: [Number],
        required: [true, 'Coordenadas são obrigatórias'],
      },
      address: String,
    },
    images: [{
      type: String,
      required: [true, 'Pelo menos uma imagem é obrigatória'],
    }],
    plateNumber: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ['pending', 'reviewing', 'approved', 'rejected'],
      default: 'pending',
    },
    reviewedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    reviewNotes: String,
  },
  {
    timestamps: true,
  }
);

// Índice geoespacial para consultas de localização
violationSchema.index({ location: '2dsphere' });

export const Violation = mongoose.model<IViolation>('Violation', violationSchema);