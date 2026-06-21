import { NextFunction, Request, Response } from 'express';
import { randomUUID } from 'crypto';
import { AppError } from '../middleware/errorHandler';
import { IUsersService } from '../services/interfaces/IUsersService';
import { successResponse } from '../utils/metadataHelper';
import { AuthTokenPayload } from '../models/dto/Auth.type';

export class UsersController {
    private readonly usersService: IUsersService
	constructor(usersService: IUsersService) {
        this.usersService = usersService;
    }

	getAllAgents = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
		try {
			const agents = await this.usersService.getAllAgents();
			res.status(200).json(successResponse(agents));
		} catch (error) {
			const appError = new Error('Failed to retrieve agents') as AppError;
			appError.statusCode = 500;
			appError.errorCode = 'APP-DB-011';
			appError.transactionId = res.locals.transactionId || randomUUID();
			appError.stack = error instanceof Error ? error.stack : undefined;
			next(appError);
		}
	};

      assignAgentToTicket = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const ticketId = Number(req.params.ticketId);
      const agentId = Number(req.params.agentId);
      const authProfile: AuthTokenPayload = res.locals.authProfile;

      const assignment = await this.usersService.assignAgentToTicket(ticketId, agentId, authProfile);

      if (!assignment) {
        const appError = new Error('Ticket not found') as AppError;
        appError.statusCode = 404;
        appError.errorCode = 'APP-404';
        appError.transactionId = res.locals.transactionId || randomUUID();
        return next(appError);
      }

      res.status(200).json(successResponse(assignment));
    } catch (error) {
      if (error instanceof Error && error.message === 'AGENT_NOT_FOUND') {
        const appError = new Error('Agent not found') as AppError;
        appError.statusCode = 404;
        appError.errorCode = 'APP-404';
        appError.transactionId = res.locals.transactionId || randomUUID();
        return next(appError);
      }

      if (error instanceof Error && error.message === 'INVALID_AGENT_ROLE') {
        const appError = new Error('Selected user is not an assignable agent') as AppError;
        appError.statusCode = 409;
        appError.errorCode = 'APP-BIZ-002';
        appError.transactionId = res.locals.transactionId || randomUUID();
        return next(appError);
      }

      const appError = new Error('Failed to assign agent to ticket') as AppError;
      appError.statusCode = 500;
      appError.errorCode = 'APP-DB-010';
      appError.transactionId = res.locals.transactionId || randomUUID();
      appError.stack = error instanceof Error ? error.stack : undefined;
      next(appError);
    }
  }

}

