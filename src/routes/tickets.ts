import { Router } from 'express';
import { container } from '../config/dependencies';
import { requireAccessToken } from '../middleware/permissions/auth';
import { validateCreateTicket, validateTicketIdParam, validateTicketIdStatus } from '../middleware/ticketValidators';
import { AppTypes } from '../utils/AppTypes';

const router = Router();
const { ticketsController } = container.controllers;
const { ticketInteractions } = container.middlewares;

router.get('/users/:userId/tickets', requireAccessToken, ticketsController.getTicketsByUserId);
router.get('/', 
    requireAccessToken
    ,ticketInteractions.validateUserPermissions({ permissionIds: [AppTypes.PERMISSIONS.VIEW_ALL_TICKETS] })
    ,ticketsController.getAllTickets
);
router.get('/:ticketId/users', requireAccessToken, validateTicketIdParam, ticketsController.getTicketUserIds);
router.post('/', requireAccessToken, validateCreateTicket, ticketsController.createTicket);
router.get('/:ticketId', 
    requireAccessToken
    ,validateTicketIdParam
    ,ticketInteractions.canInteractWithTicket({ permissionIds: [AppTypes.PERMISSIONS.VIEW_ALL_TICKETS] })
    ,ticketsController.getTicketDetail
);
router.get('/:ticketId/available-transitions', 
    requireAccessToken
    ,validateTicketIdParam
    ,ticketInteractions.canInteractWithTicket({ permissionIds: [AppTypes.PERMISSIONS.VIEW_ALL_TICKETS] })
    ,ticketsController.getAvailableTransitions
);
// router.post('/:ticketId/transition/:statusId',
//     requireAccessToken
//     ,validateTicketIdStatus
//     ,ticketInteractions.canInteractWithTicket({ permissionIds: 
//         [
//             AppTypes.PERMISSIONS.TICKET_ASSIGN, 
//             AppTypes.PERMISSIONS.TICKET_CLOSE, 
//             AppTypes.PERMISSIONS.TICKET_CREATE,
//             AppTypes.PERMISSIONS.TICKET_ASSIGN,
//             AppTypes.PERMISSIONS.TICKET_IN_PROGRESS,
//             AppTypes.PERMISSIONS.TICKET_WAIT_CLIENT,
//             AppTypes.PERMISSIONS.TICKET_RESOLVE,
//             AppTypes.PERMISSIONS.TICKET_CLOSE,
//             AppTypes.PERMISSIONS.TICKET_CLOSE_ANY
//         ] 
//     })
//     ,ticketsController.transitionTicket
// );

export default router;
