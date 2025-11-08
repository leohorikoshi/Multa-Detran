import { Request, Response } from 'express';
import {
  createViolation,
  getMyViolations,
  updateViolationStatus
} from '../violation.controller';
import { Violation } from '../../models/violation.model';
import { IViolationDocument } from '../../types/models.types';
import { Types } from 'mongoose';

// Reset all mocks before each test
beforeEach(() => {
  jest.clearAllMocks();
});

jest.mock('../../models/violation.model');

interface RequestWithUser extends Request {
  user: {
    id: string;
    _id: string;
    role: string;
    name: string;
    email: string;
  };
}

describe('Violation Controller', () => {
  let mockRequest: Partial<RequestWithUser>;
  let mockResponse: Partial<Response>;
  let mockNext: jest.Mock;

  beforeEach(() => {
    mockRequest = {
      body: {},
      user: {
        id: 'user123',
        _id: 'user123',
        role: 'user',
        name: 'Test User',
        email: 'test@example.com'
      },
      files: []
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    mockNext = jest.fn();
  });

  describe('createViolation', () => {
    const validViolationData = {
      violationType: 'parking',
      description: 'Illegal parking',
      location: {
        latitude: -23.550520,
        longitude: -46.633309,
        address: 'Test Address'
      },
      plateNumber: 'ABC1234'
    };

    it('should create violation successfully', async () => {
      mockRequest.body = validViolationData;
      mockRequest.files = [{
        filename: 'test.jpg',
        path: '/uploads/test.jpg'
      }] as Express.Multer.File[];

      const mockViolation = {
        _id: 'violation123',
        user: mockRequest.user?.id,
        ...validViolationData,
        images: ['/uploads/test.jpg'],
        status: 'pending',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      (Violation.create as jest.Mock).mockResolvedValueOnce(mockViolation);

      await createViolation(mockRequest as RequestWithUser, mockResponse as Response);

      expect(Violation.create).toHaveBeenCalledWith(
        expect.objectContaining({
          user: mockRequest.user?.id,
          violationType: validViolationData.violationType,
          description: validViolationData.description
        })
      );
      expect(mockResponse.status).toHaveBeenCalledWith(201);
  expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 'success',
          data: expect.objectContaining({
            violation: expect.objectContaining({
              _id: 'violation123'
            })
          })
        })
      );
    });

    it('should return error if no images provided', async () => {
      mockRequest.body = validViolationData;
      mockRequest.files = [];

      await createViolation(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 'error',
          message: expect.stringContaining('imagem')
        })
      );
    });
  });

  describe('getMyViolations', () => {
    it('should return user violations', async () => {
      const mockViolations = [
        {
          _id: 'violation123',
          user: mockRequest.user?.id,
          violationType: 'parking',
          status: 'pending'
        }
      ];

      const sortMock = jest.fn().mockReturnValue(mockViolations);
      const findMock = jest.fn().mockReturnValue({ sort: sortMock });
      (Violation.find as jest.Mock) = findMock;

      await getMyViolations(mockRequest as RequestWithUser, mockResponse as Response);

      expect(Violation.find).toHaveBeenCalledWith({ user: mockRequest.user?.id });
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 'success',
          data: {
            violations: expect.arrayContaining([
              expect.objectContaining({
                _id: mockViolations[0]._id
              })
            ])
          }
        })
      );
    });
  });

  describe('updateViolationStatus', () => {
    beforeEach(() => {
      jest.resetAllMocks();
    });

    it('should update violation status as admin', async () => {
      mockRequest.user = {
        id: 'admin123',
        _id: 'admin123',
        role: 'admin',
        name: 'Admin User',
        email: 'admin@example.com'
      };
      mockRequest.params = { id: '507f1f77bcf86cd799439011' };
      mockRequest.body = { status: 'approved' };

      const violationId = '507f1f77bcf86cd799439011';
      const mockViolation = {
        _id: violationId,
        status: 'pending'
      };

      (Violation.findById as jest.Mock).mockResolvedValueOnce(mockViolation);
      (Violation.findById as jest.Mock).mockResolvedValueOnce({
        ...mockViolation,
        status: 'approved'
      });
      
      const updateOne = jest.fn().mockResolvedValueOnce({ modifiedCount: 1 });
      (Violation as any).updateOne = updateOne;

      console.log('Mock violation:', mockViolation);
      console.log('Mock request:', mockRequest);
      await updateViolationStatus(mockRequest as RequestWithUser, mockResponse as Response);
      await updateViolationStatus(mockRequest as RequestWithUser, mockResponse as Response);

      expect(updateOne).toHaveBeenCalledWith(
        { _id: violationId },
        { $set: {
            status: 'approved',
            reviewNotes: undefined,
            reviewedBy: expect.any(String)
          }
        }
      );
      
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        status: 'success',
        data: {
          violation: expect.objectContaining({
            _id: violationId,
            status: 'approved'
          })
        }
      });
    });

    it('should return error if not admin', async () => {
      mockRequest.user = {
        id: 'user123',
        _id: 'user123',
        role: 'user',
        name: 'Test User',
        email: 'test@example.com'
      };
      mockRequest.params = { id: 'violation123' };
      mockRequest.body = { status: 'approved' };

      const mockViolation = {
        _id: 'violation123',
        status: 'pending',
        updateOne: jest.fn().mockResolvedValue({ nModified: 1 })
      };

      (Violation.findById as jest.Mock).mockResolvedValueOnce(mockViolation);

      await updateViolationStatus(mockRequest as RequestWithUser, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(403);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 'error',
           message: expect.stringContaining('administradores')
        })
      );
    });
  });
});