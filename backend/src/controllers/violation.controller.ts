import { Request, Response } from 'express';
import { Violation } from '../models/violation.model';

interface RequestWithUser extends Request {
  user: {
    id: string;
    _id: string;
    role: string;
    name: string;
    email: string;
  };
}

export const createViolation = async (req: RequestWithUser, res: Response): Promise<Response> => {
  try {
    if (!req.user) {
      return res.status(401).json({
        status: 'error',
        message: 'Não autorizado',
      });
    }
    const {
      violationType,
      description,
      location,
      plateNumber,
    } = req.body;

    // Processar arquivos enviados
    const images = (req.files as Express.Multer.File[])?.map(
      (file) => `/uploads/${file.filename}`
    ) || [];

    if (images.length === 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Pelo menos uma imagem é necessária',
      });
    }

    const violation = await Violation.create({
      user: req.user._id,
      violationType,
      description,
      location: {
        type: 'Point',
        coordinates: [location.longitude, location.latitude],
        address: location.address,
      },
      images,
      plateNumber,
    });

    return res.status(201).json({
      status: 'success',
      data: { violation },
    });
  } catch (error: any) {
    return res.status(400).json({
      status: 'error',
      message: error.message,
    });
  }
};

export const getMyViolations = async (req: RequestWithUser, res: Response): Promise<Response> => {
  try {
    if (!req.user) {
      return res.status(401).json({
        status: 'error',
        message: 'Não autorizado',
      });
    }
    const violations = await Violation.find({ user: req.user._id })
      .sort({ createdAt: -1 });

    return res.status(200).json({
      status: 'success',
      data: { violations },
    });
  } catch (error: any) {
    return res.status(400).json({
      status: 'error',
      message: error.message,
    });
  }
};

export const getViolationById = async (req: RequestWithUser, res: Response): Promise<Response> => {
  try {
    if (!req.user) {
      return res.status(401).json({
        status: 'error',
        message: 'Não autorizado',
      });
    }
    const violation = await Violation.findById(req.params.id);

    if (!violation) {
      return res.status(404).json({
        status: 'error',
        message: 'Denúncia não encontrada',
      });
    }

    // Verificar se o usuário tem permissão para ver a denúncia
    if (
      violation.user.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        status: 'error',
        message: 'Você não tem permissão para ver esta denúncia',
      });
    }

    return res.status(200).json({
      status: 'success',
      data: { violation },
    });
  } catch (error: any) {
    return res.status(400).json({
      status: 'error',
      message: error.message,
    });
  }
};

export const updateViolationStatus = async (req: RequestWithUser, res: Response): Promise<Response> => {
  try {
    if (!req.user) {
      return res.status(401).json({
        status: 'error',
        message: 'Não autorizado',
      });
    }
    const { status, reviewNotes } = req.body;

    const violation = await Violation.findById(req.params.id);

    if (!violation) {
      return res.status(404).json({
        status: 'error',
        message: 'Denúncia não encontrada',
      });
    }

    // Apenas administradores podem atualizar o status
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        status: 'error',
        message: 'Apenas administradores podem atualizar o status',
      });
    }

    await Violation.updateOne(
      { _id: violation._id },
      {
        $set: {
          status,
          reviewNotes,
          reviewedBy: req.user._id
        }
      }
    );

    const updatedViolation = await Violation.findById(violation._id);
    return res.status(200).json({
      status: 'success',
      data: { violation: updatedViolation },
    });
  } catch (error: any) {
    return res.status(400).json({
      status: 'error',
      message: error.message,
    });
  }
};

export const getAllViolations = async (req: RequestWithUser, res: Response): Promise<Response> => {
  try {
    if (!req.user) {
      return res.status(401).json({
        status: 'error',
        message: 'Não autorizado',
      });
    }
    // Apenas administradores podem ver todas as denúncias
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        status: 'error',
        message: 'Apenas administradores podem ver todas as denúncias',
      });
    }

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const violations = await Violation.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('user', 'name email');

    const total = await Violation.countDocuments();

    return res.status(200).json({
      status: 'success',
      data: {
        violations,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error: any) {
    return res.status(400).json({
      status: 'error',
      message: error.message,
    });
  }
};