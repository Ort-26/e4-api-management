import { Request, Response, NextFunction } from "express";
import { IRolesRepository } from "../../repositories/interfaces/IRolesRepository";
import { AppError } from "../errorHandler";
import { randomUUID } from "crypto";
import { ITicketsUsersRepository } from "../../repositories/interfaces/ITicketsUsersRepository";
import { ITicketsRepository } from "../../repositories/interfaces/ITicketsRepository";



export class TicketInteractions {
    private rolesRepository: IRolesRepository;
    private ticketsUsersRepository: ITicketsUsersRepository;
    private ticketsRepository: ITicketsRepository;
    private defaultForbiddenMessage = "You do not have permission to interact with this ticket or it does not exist.";

    constructor(rolesRepository: IRolesRepository, ticketsUsersRepository: ITicketsUsersRepository, ticketsRepository: ITicketsRepository) {
        this.rolesRepository = rolesRepository;
        this.ticketsUsersRepository = ticketsUsersRepository;
        this.ticketsRepository = ticketsRepository;
    }


    validateUserPermissions = (options: {permissionIds: number[];}) => {
          return async (req: Request, res: Response, next: NextFunction) => {
            const authProfile = res.locals.authProfile;
            const userPermissions = await this.rolesRepository.getPermissionsByRoleId(authProfile.roleId) || [];
            const canInteract = userPermissions.some(permission => options.permissionIds.includes(permission.permissionId));
            const idsPermissions = userPermissions.map(p => p.permissionId);
            console.log(idsPermissions);
            if (!canInteract) {
                return next(this.buildForbiddenError(res, this.defaultForbiddenMessage));
            }
            // console.log(userPermissions);
            console.log(canInteract);
            return next();
        }
    }

    canInteractWithTicket = (options: {permissionIds: number[];}) => {
    
    return async (req: Request, res: Response, next: NextFunction) => {
            const authProfile = res.locals.authProfile;
            const userPermissions = await this.rolesRepository.getPermissionsByRoleId(authProfile.roleId) || [];
            const canInteract = userPermissions.some(permission => options.permissionIds.includes(permission.permissionId));
            const ticketsByUser = await this.ticketsUsersRepository.getUsersByTicketId(Number(req.params.ticketId)) || [];
            const isOwner = ticketsByUser.some(userId => userId === authProfile.userId);
            const ticketData = await this.ticketsRepository.getTicketById(Number(req.params.ticketId));
            if (!ticketData) return next(this.buildForbiddenError(res, this.defaultForbiddenMessage));
            const isAssignedAgent = ticketData?.agentId === authProfile.userId;
            if (!canInteract && !isOwner && !isAssignedAgent) {
                return next(this.buildForbiddenError(res, this.defaultForbiddenMessage));
            }
            return next();
        }
    }
    private buildForbiddenError = (res: Response, message: string): AppError => {
      const appError = new Error(message) as AppError;
      appError.statusCode = 403;
      appError.errorCode = 'APP-AUTH-403';
      appError.message = message;
      appError.transactionId = res.locals.transactionId || randomUUID();
      return appError;
    };
        
}

