import { Router } from 'express';
import { container } from '../config/dependencies';

const router = Router();
const { authController } = container.controllers;

router.post('/login', authController.login);
router.post('/refresh', authController.refresh);
router.post('/logout', authController.logout);

export default router;
