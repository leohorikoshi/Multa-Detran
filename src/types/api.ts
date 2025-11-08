export interface User {
  id: string;
  name: string;
  email: string;
  cpf: string;
  createdAt: Date;
}

export interface TrafficViolation {
  id: string;
  userId: string;
  location: {
    latitude: number;
    longitude: number;
    address?: string;
  };
  violationType: string;
  description: string;
  images: string[];
  plateNumber?: string;
  status: 'pending' | 'reviewing' | 'approved' | 'rejected';
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface ApiError {
  code: string;
  message: string;
  details?: any;
}