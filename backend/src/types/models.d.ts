import { Document } from 'mongoose';

export interface IUserDocument extends Document {
  _id: string;
  name: string;
  email: string;
  password: string;
  cpf: string;
  role: 'user' | 'admin';
  comparePassword(candidatePassword: string): Promise<boolean>;
}