import { NextFunction, Request, Response } from 'express';
import { randomUUID } from 'crypto';
import { AppError } from '../middleware/errorHandler';
import { CreateTicketRequest } from '../models/request/CreateTicketRequest.type';
import { ITicketsService } from '../services/interfaces/ITicketsService';
import { successResponse } from '../utils/metadataHelper';

export class TicketsController {
  constructor(private readonly ticketsService: ITicketsService) {}

  getAllTickets = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      //TODO - Get credentials, if role = client use id to filter tickets by ownership, if role = agent / admin return all tickets
      const tickets = await this.ticketsService.getAllTickets();
      res.status(200).json(successResponse(tickets));
    } catch (error) {
      const appError = new Error('Failed to retrieve tickets') as AppError;
      appError.statusCode = 500;
      appError.errorCode = 'APP-DB-002';
      appError.transactionId = res.locals.transactionId || randomUUID();
      appError.stack = error instanceof Error ? error.stack : undefined;
      next(appError);
    }
  };

  getTicketDetail = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const ticketId = Number(req.params.ticketId);
      const ticketDetail = await this.ticketsService.getTicketDetail(ticketId);
      if (!ticketDetail) {
        const appError = new Error('Ticket not found') as AppError;
        appError.statusCode = 404;
        appError.errorCode = 'APP-404';
        appError.transactionId = res.locals.transactionId || randomUUID();
        return next(appError);
      }
      res.status(200).json(successResponse(ticketDetail));
    } catch (error) {
      const appError = new Error('Failed to retrieve ticket detail') as AppError;
      appError.statusCode = 500;
      appError.errorCode = 'APP-DB-003';
      appError.transactionId = res.locals.transactionId || randomUUID();
      appError.stack = error instanceof Error ? error.stack : undefined;
      next(appError);
    }
  };

  createTicket = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const payload = req.body as CreateTicketRequest;
      const authUserId = Number(res.locals.authUserId);
      const ticket = await this.ticketsService.createTicket(payload, authUserId);
      res.status(201).json(successResponse({ 
        ticketId: ticket.ticketId, 
        createdAt: ticket.createdAt, 
        statusId: ticket.statusId 
      }));
    } catch (error) {
      const appError = new Error('Failed to create ticket') as AppError;
      appError.statusCode = 500;
      appError.errorCode = 'APP-DB-004';
      appError.transactionId = res.locals.transactionId || randomUUID();
      appError.stack = error instanceof Error ? error.stack : undefined;
      next(appError);
    }
  };

  getAvailableTransitions = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const ticketId = Number(req.params.ticketId);
      // Placeholder for actual implementation
      // Extract authUserId
      // Service: check if user can view ticket by role/permission or by ownership, if not return 403
      // Service: based on ctl_ticket_status_transitions and actual state get the available transitions, if no transitions available return empty array
      const availableTransitions = [
        { statusId: 2, statusName: 'In Progress' },
        { statusId: 3, statusName: 'Resolved' },
        { statusId: 4, statusName: 'Closed' },
      ];
      res.status(200).json(successResponse(availableTransitions));
    } catch (error) {
      const appError = new Error('Failed to retrieve available transitions') as AppError;
      appError.statusCode = 500;
      appError.errorCode = 'APP-DB-005';
      appError.transactionId = res.locals.transactionId || randomUUID();
      appError.stack = error instanceof Error ? error.stack : undefined;
      next(appError);
    }
  }

}
