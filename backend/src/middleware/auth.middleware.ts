import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/user.model';
import { JwtPayload } from '../types/auth.types';
import { IUserDocument } from '../types/models.types';

interface RequestWithUser extends Request {
  user?: {
    id: string;
    _id: string;
    role: string;
    name: string;
    email: string;
  };
}

export const protect = async (
  req: RequestWithUser,
  res: Response,
  next: NextFunction
): Promise<void | Response> => {
  try {
    // 1. Verificar se o token existe
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        status: 'error',
        message: 'Você não está autenticado',
      });
    }

    // 2. Validar o token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'sua_chave_secreta'
    ) as JwtPayload;

    // 3. Verificar se o usuário ainda existe
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({
        status: 'error',
        message: 'O usuário não existe mais',
      });
    }

    // 4. Atribuir o usuário à requisição
    const typedUser = user as IUserDocument;
    const id = typedUser._id.toString();
    req.user = {
      id,
      _id: id,
      role: typedUser.role,
      name: typedUser.name,
      email: typedUser.email,
    };
    next();
  } catch (error) {
    return res.status(401).json({
      status: 'error',
      message: 'Token inválido ou expirado',
    });
  }
};

export const restrictTo = (...roles: string[]) => {
  return (req: RequestWithUser, res: Response, next: NextFunction): void | Response => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        status: 'error',
        message: 'Você não tem permissão para realizar esta ação',
      });
    }
    next();
  };
};