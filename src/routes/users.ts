import { Router } from 'express';
import { container } from '../config/dependencies';
import { requireAccessToken } from '../middleware/permissions/auth';
import { AppTypes } from '../utils/AppTypes';
import { validateTicketIdAgent } from '../middleware/ticketValidators';

const router = Router();

const { usersController } = container.controllers;
const { ticketInteractions } = container.middlewares;

router.get('/agents',
  requireAccessToken,
  ticketInteractions.validateUserPermissions({
    permissionIds: [AppTypes.PERMISSIONS.TICKET_ASSIGN],
  }),
  usersController.getAllAgents,
);

router.post('/:ticketId/assign/:agentId',
    requireAccessToken,
    validateTicketIdAgent,
    ticketInteractions.validateUserPermissions({
        permissionIds: [AppTypes.PERMISSIONS.TICKET_ASSIGN]
    }),
    usersController.assignAgentToTicket
);

export default router;
