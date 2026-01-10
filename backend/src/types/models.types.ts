import { Document } from 'mongoose';
import { IUser } from './auth.types';

export interface IUserDocument extends Document, IUser {
  _id: any;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

export interface IViolation {
  description: string;
  location: {
    latitude: number;
    longitude: number;
    address?: string;
  };
  images: string[];
  status: 'pending' | 'approved' | 'rejected';
  licensePlate: string;
  vehicleType: string;
  user: string;
  reviewedBy?: string;
  reviewNote?: string;
}

export interface IViolationDocument extends Document, IViolation {
  _id: any;
  createdAt: Date;
  updatedAt: Date;
}