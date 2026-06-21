import { Router } from 'express';
import { container } from '../config/dependencies';
import { requireAccessToken } from '../middleware/permissions/auth';

const router = Router();
const { authController } = container.controllers;

router.post('/login', authController.login);
router.post('/refresh', authController.refresh);
router.post('/logout', authController.logout);
router.get('/me', requireAccessToken, authController.me);

export default router;
