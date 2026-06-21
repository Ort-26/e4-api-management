import { Router } from 'express';
import { container } from '../config/dependencies';
import { requireAccessToken } from '../middleware/permissions/auth';
import {
    validateCreateTicket,
    validateCreateTicketComment,
    validateTicketIdAgent,
    validateTicketIdParam,
    validateTicketIdStatus
} from '../middleware/ticketValidators';
import { AppTypes } from '../utils/AppTypes';

const router = Router();

const { ticketsController } = container.controllers;
const { ticketInteractions } = container.middlewares;

router.get('/',
    requireAccessToken,
    ticketInteractions.validateUserPermissions({
        permissionIds: [AppTypes.PERMISSIONS.TICKET_READ_ALL]
    }),
    ticketsController.getAllTickets
);

router.post('/',
    requireAccessToken,
    ticketInteractions.validateUserPermissions({
        permissionIds: [AppTypes.PERMISSIONS.TICKET_CREATE]
    }),
    validateCreateTicket,
    ticketsController.createTicket
);

router.get('/:ticketId/users',
    requireAccessToken,
    validateTicketIdParam,
    ticketInteractions.canInteractWithTicket({
        permissionIds: [AppTypes.PERMISSIONS.TICKET_READ_ALL]
    }),
    ticketsController.getTicketUserIds
);

router.get('/:ticketId',
    requireAccessToken,
    validateTicketIdParam,
    ticketInteractions.canInteractWithTicket({
        permissionIds: [AppTypes.PERMISSIONS.TICKET_READ_ALL]
    }),
    ticketsController.getTicketDetail
);

router.get('/:ticketId/available-transitions',
    requireAccessToken,
    validateTicketIdParam,
    ticketInteractions.canInteractWithTicket({
        permissionIds: [AppTypes.PERMISSIONS.TICKET_READ_ALL]
    }),
    ticketsController.getAvailableTransitions
);

router.post('/:ticketId/comments',
    requireAccessToken,
    validateCreateTicketComment,
    ticketInteractions.canInteractWithTicket({
        permissionIds: [AppTypes.PERMISSIONS.TICKET_READ_ALL]
    }),
    ticketInteractions.validateUserPermissions({
        permissionIds: [AppTypes.PERMISSIONS.TICKET_COMMENT]
    }),
    ticketsController.addCommentToTicket
);

router.post('/:ticketId/transition/:statusId',
    requireAccessToken,
    validateTicketIdStatus,
    ticketInteractions.canInteractWithTicket({
        permissionIds: [AppTypes.PERMISSIONS.TICKET_READ_ALL]
    }),
    ticketsController.transitionTicket
);

export default router;