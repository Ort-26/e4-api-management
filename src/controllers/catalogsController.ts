import { NextFunction, Request, Response } from 'express';
import { randomUUID } from 'crypto';
import { AppError } from '../middleware/errorHandler';
import { ICatalogsService } from '../services/interfaces/ICatalogsService';
import { successResponse } from '../utils/metadataHelper';
import { CatTicketStatuses } from '../models/domain/cat-ticket-statuses.type';

export class CatalogsController {
  constructor(private readonly catalogsService: ICatalogsService) {}

  getAllTicketStatuses = async (_req: Request,res: Response, next: NextFunction): Promise<void> => {
    try {
      const statuses: CatTicketStatuses[] = await this.catalogsService.getAllTicketStatuses();
      res.status(200).json(successResponse(statuses));
    } catch (error) {
      const appError = new Error('Failed to retrieve ticket statuses') as AppError;
      appError.statusCode = 500;
      appError.errorCode = 'APP-DB-001';
      appError.transactionId = res.locals.transactionId || randomUUID();
      appError.stack = error instanceof Error ? error.stack : undefined;
      next(appError);
    }
  };
}
