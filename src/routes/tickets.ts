import { Router } from 'express';
import { TicketsController } from '../controllers/ticketsController';
import { requireAccessToken } from '../middleware/auth';
import { ticketsRepository } from '../repositories/impl/TicketsRepository';
import { TicketsService } from '../services/impl/TicketsService';
import { validateCreateTicket, validateTicketIdParam } from '../middleware/ticketValidators';

const router = Router();
const ticketsService = new TicketsService(ticketsRepository);
const ticketsController = new TicketsController(ticketsService);

router.get('/', ticketsController.getAllTickets);
router.get('/:ticketId', requireAccessToken, validateTicketIdParam, ticketsController.getTicketDetail);
router.post('/', requireAccessToken, validateCreateTicket, ticketsController.createTicket);
router.get('/:ticketId/available-transitiones', requireAccessToken, validateTicketIdParam, ticketsController.getAvailableTransitions);

export default router;
