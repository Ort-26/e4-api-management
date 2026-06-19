import { Router } from 'express';
import { AuthController } from '../controllers/authController';
import { authRepository } from '../repositories/impl/AuthRepository';
import { AuthService } from '../services/impl/AuthService';

const router = Router();
const authService = new AuthService(authRepository);
const authController = new AuthController(authService);

router.post('/login', authController.login);
router.post('/refresh', authController.refresh);
router.post('/logout', authController.logout);

export default router;
