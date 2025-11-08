export interface User {
  id: string;
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
}

export interface Violation {
  _id: string;
  user: { name: string; email: string } | string;
  plateNumber: string;
  description: string;
  location: {
    type: 'Point';
    coordinates: [number, number];
    address: string;
  };
  images: string[];
  status: 'pending' | 'approved' | 'rejected';
  reviewedBy?: string;
  reviewNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}