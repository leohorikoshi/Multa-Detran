import express from 'express';
import { register, login, getProfile } from '../controllers/auth.controller';
import { protect } from '../middleware/auth.middleware';
import { validateRequest } from '../middleware/validation.middleware';
import { registerSchema, loginSchema } from '../utils/validation.schemas';

const router = express.Router();

router.post('/register', validateRequest(registerSchema), register);
router.post('/login', validateRequest(loginSchema), login);
router.get('/profile', protect, getProfile);

export default router;