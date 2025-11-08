export interface IUser {
  name: string;
  email: string;
  password: string;
  cpf: string;
  role: 'user' | 'admin';
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData extends Pick<IUser, 'name' | 'email' | 'password' | 'cpf'> {
  name: string;
  email: string;
  password: string;
  cpf: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    cpf: string;
    role: string;
  };
}

export interface JwtPayload {
  id: string;
  role: string;
}