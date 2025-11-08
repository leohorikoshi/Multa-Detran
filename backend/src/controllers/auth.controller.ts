import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/user.model';
import { LoginCredentials, RegisterData, AuthResponse } from '../types/auth.types';
import { AsyncController, createResponse } from '../types/controller.types';
import { IUserDocument } from '../types/models.types';

const generateToken = (id: string, role: string): string => {
  const payload = { id, role };
  const secret = process.env.JWT_SECRET || 'sua_chave_secreta';
  const options = { expiresIn: process.env.JWT_EXPIRES_IN || '7d' } as jwt.SignOptions;
  return jwt.sign(payload, secret, options);
};

const createUserResponse = (user: IUserDocument, token: string): AuthResponse => ({
  token,
  user: {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    cpf: user.cpf,
    role: user.role,
  },
});

export const register: AsyncController = async (req: Request, res: Response) => {
  try {
    const data: RegisterData = req.body;
    
    // Verificar se já existe um usuário
    const existingUser = await User.findOne({
      $or: [{ email: data.email }, { cpf: data.cpf }]
    });

    if (existingUser) {
      return res.status(400).json(
        createResponse(false, null, 'Email ou CPF já cadastrado')
      );
    }

    // Criar novo usuário
    const newUser = await User.create({
      name: data.name,
      email: data.email,
      password: data.password,
      cpf: data.cpf,
      role: 'user'
    }) as IUserDocument;

    const token = generateToken(newUser._id.toString(), newUser.role);
    const responseData = createUserResponse(newUser, token);

    return res.status(201).json(
      createResponse(true, responseData)
    );
  } catch (error: any) {
    return res.status(400).json(
      createResponse(false, null, error.message || 'Erro ao criar conta')
    );
  }
};

export const login: AsyncController = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body as LoginCredentials;

    if (!email || !password) {
      return res.status(401).json(
        createResponse(false, null, 'Por favor, forneça email e senha')
      );
    }

    const user = await User.findOne({ email }).select('+password') as IUserDocument;
    
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json(
        createResponse(false, null, 'Email ou senha incorretos')
      );
    }

    const token = generateToken(user._id.toString(), user.role);
    const responseData = createUserResponse(user, token);

    return res.status(200).json(
      createResponse(true, responseData)
    );
  } catch (error: any) {
    return res.status(400).json(
      createResponse(false, null, error.message || 'Erro ao fazer login')
    );
  }
};

export const getProfile: AsyncController = async (req: Request, res: Response) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json(
        createResponse(false, null, 'Não autorizado')
      );
    }

    const user = await User.findById(req.user.id) as IUserDocument;
    
    if (!user) {
      return res.status(404).json(
        createResponse(false, null, 'Usuário não encontrado')
      );
    }

    const userData = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      cpf: user.cpf,
      role: user.role,
    };

    return res.status(200).json(
      createResponse(true, { user: userData })
    );
  } catch (error: any) {
    return res.status(400).json(
      createResponse(false, null, error.message || 'Erro ao buscar perfil')
    );
  }
};