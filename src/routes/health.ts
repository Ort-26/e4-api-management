import { Router } from 'express';
import { getHealth } from '../controllers/healthController';

const router = Router();

/**
 * @route   GET /health
 * @desc    Health check endpoint
 * @access  Public
 */
router.get('/', getHealth);

export default router;
