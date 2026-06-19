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
}
