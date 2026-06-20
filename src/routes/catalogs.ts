import { Router } from 'express';
import { container } from '../config/dependencies';

const router = Router();
const { catalogsController } = container.controllers;

router.get('/ticket-status', catalogsController.getAllTicketStatuses);

export default router;
