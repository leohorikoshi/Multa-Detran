import express from 'express';
import {
  createViolation,
  getMyViolations,
  getViolationById,
  updateViolationStatus,
  getAllViolations,
} from '../controllers/violation.controller';
import { protect, restrictTo } from '../middleware/auth.middleware';
import { upload } from '../utils/upload';
import { processImages } from '../middleware/image.middleware';
import { validateRequest } from '../middleware/validation.middleware';
import { validateImageAuthenticityDev } from '../middleware/image-validation.middleware';
import { violationSchema, statusUpdateSchema } from '../utils/validation.schemas';

const router = express.Router();

// Proteger todas as rotas
router.use(protect);

// Rotas públicas (para usuários autenticados)
router.post('/',
  upload.array('images', 5),
  validateImageAuthenticityDev, // Validação de autenticidade de imagem
  processImages,
  validateRequest(violationSchema),
  createViolation as any
);
router.get('/my', getMyViolations as any);
router.get('/:id', getViolationById as any);

// Rotas apenas para administradores
router.get('/', restrictTo('admin'), getAllViolations as any);
router.patch('/:id/status',
  restrictTo('admin'),
  validateRequest(statusUpdateSchema),
  updateViolationStatus as any
);

export default router;