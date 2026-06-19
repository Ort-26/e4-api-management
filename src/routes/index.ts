import { Router } from 'express';
import healthRouter from './health';
import catalogsRouter from './catalogs';
import ticketsRouter from './tickets';
import authRouter from './auth';

const router = Router();

router.use('/health', healthRouter);
router.use('/auth', authRouter);
router.use('/catalogs', catalogsRouter);
router.use('/tickets', ticketsRouter);

export default router;
