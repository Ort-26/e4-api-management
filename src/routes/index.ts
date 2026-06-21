import { Router } from 'express';
import healthRouter from './health';
import catalogsRouter from './catalogs';
import ticketsRouter from './tickets';
import authRouter from './auth';
import meRouter from './me';
import usersRouter from './users';

const router = Router();

router.use('/health', healthRouter);
router.use('/auth', authRouter);
router.use('/catalogs', catalogsRouter);
router.use('/tickets', ticketsRouter);
router.use('/me', meRouter);
router.use('/users', usersRouter);

export default router;
