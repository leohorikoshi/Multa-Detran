import { Request, Response } from 'express';
import { register, login } from '../auth.controller';
import { User } from '../../models/user.model';
import jwt from 'jsonwebtoken';

jest.mock('../../models/user.model');
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');

interface RequestWithUser extends Request {
  user?: {
    id: string;
    _id: string;
    role: string;
    name: string;
    email: string;
  };
}

describe('Auth Controller', () => {
  let mockRequest: Partial<RequestWithUser>;
  let mockResponse: Partial<Response>;

  beforeEach(() => {
    mockRequest = {
      body: {}
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  });

  describe('register', () => {
    const validRegisterData = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
      cpf: '12345678901'
    };

    it('should create a new user successfully', async () => {
      mockRequest.body = validRegisterData;
      const mockUser = {
        _id: 'user123',
        ...validRegisterData,
        role: 'user'
      };

      (User.findOne as jest.Mock).mockResolvedValueOnce(null);
      (User.create as jest.Mock).mockResolvedValueOnce(mockUser);
      (jwt.sign as jest.Mock).mockReturnValueOnce('mockToken');

      await register(mockRequest as Request, mockResponse as Response);

      expect(User.findOne).toHaveBeenCalledWith({
        $or: [
          { email: validRegisterData.email },
          { cpf: validRegisterData.cpf }
        ]
      });
      expect(User.create).toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 'success',
          data: expect.objectContaining({
            token: 'mockToken',
            user: expect.objectContaining({
              id: mockUser._id,
              name: mockUser.name,
              email: mockUser.email
            })
          })
        })
      );
    });

    it('should return error for existing user', async () => {
      mockRequest.body = validRegisterData;
      (User.findOne as jest.Mock).mockResolvedValueOnce({ email: validRegisterData.email });

      await register(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 'error',
          message: expect.stringContaining('já cadastrado')
        })
      );
    });
  });

  describe('login', () => {
    const validLoginData = {
      email: 'test@example.com',
      password: 'password123'
    };

      const mockUser = {
      _id: 'user123',
      email: validLoginData.email,
      password: 'hashedPassword',
      role: 'user',
      comparePassword: jest.fn().mockResolvedValueOnce(true)
    };    it('should login user successfully', async () => {
      mockRequest.body = validLoginData;
      
      const findOneReturn = {
        select: jest.fn().mockReturnValueOnce(mockUser)
      };
      (User.findOne as jest.Mock).mockReturnValueOnce(findOneReturn);
      (jwt.sign as jest.Mock).mockReturnValueOnce('mockToken');

      await login(mockRequest as Request, mockResponse as Response);

      expect(User.findOne).toHaveBeenCalledWith({ email: validLoginData.email });
      expect(mockUser.comparePassword).toHaveBeenCalledWith(validLoginData.password);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 'success',
          data: expect.objectContaining({
            token: 'mockToken'
          })
        })
      );
    });

    it('should return error for invalid credentials', async () => {
      mockRequest.body = validLoginData;
      
      const mockUserWithInvalidPassword = {
        ...mockUser,
        comparePassword: jest.fn().mockResolvedValueOnce(false)
      };
      const findOneReturn = {
        select: jest.fn().mockReturnValueOnce(mockUserWithInvalidPassword)
      };
      (User.findOne as jest.Mock).mockReturnValueOnce(findOneReturn);

      await login(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 'error',
           message: expect.stringContaining('incorretos')
        })
      );
    });

    it('should return error for non-existent user', async () => {
      mockRequest.body = validLoginData;
      
      const findOneReturn = {
        select: jest.fn().mockReturnValueOnce(null)
      };
      (User.findOne as jest.Mock).mockReturnValueOnce(findOneReturn);

      await login(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 'error',
           message: expect.stringContaining('incorretos')
        })
      );
    });
  });
});