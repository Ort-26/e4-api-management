import { NextFunction, Request, Response } from 'express';
import { randomUUID } from 'crypto';
import { AppError } from '../middleware/errorHandler';
import { CreateTicketRequest } from '../models/request/CreateTicketRequest.type';
import { ITicketsService } from '../services/interfaces/ITicketsService';
import { successResponse } from '../utils/metadataHelper';
import { AuthTokenPayload } from '../models/dto/Auth.type';
import { CatTicketStatuses } from '../models/domain/cat-ticket-statuses.type';
import { TicketComment } from '../models/request/TicketComment.type';

export class MeController {
  constructor(private readonly ticketsService: ITicketsService) {}
    getMyTickets = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const authProfile: AuthTokenPayload = res.locals.authProfile;
        const userId = authProfile.userId;
        const tickets = await this.ticketsService.getTicketsByUserId(userId);
        res.status(200).json(successResponse(tickets));
    } catch (error) {
        const appError = new Error('Failed to retrieve tickets by user') as AppError;
        appError.statusCode = 500;
        appError.errorCode = 'APP-DB-006';
        appError.transactionId = res.locals.transactionId || randomUUID();
        appError.stack = error instanceof Error ? error.stack : undefined;
        next(appError);
    }
  };

}