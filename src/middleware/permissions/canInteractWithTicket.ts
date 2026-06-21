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

    private defaultForbiddenMessage =
        "You do not have permission to interact with this ticket or it does not exist.";

    constructor(
        rolesRepository: IRolesRepository,
        ticketsUsersRepository: ITicketsUsersRepository,
        ticketsRepository: ITicketsRepository
    ) {
        this.rolesRepository = rolesRepository;
        this.ticketsUsersRepository = ticketsUsersRepository;
        this.ticketsRepository = ticketsRepository;
    }

    validateUserPermissions = (options: { permissionIds: number[] }) => {
        return async (req: Request, res: Response, next: NextFunction) => {
            try {
                const authProfile = res.locals.authProfile;

                if (!authProfile) {
                    return next(this.buildUnauthorizedError(res));
                }

                const userPermissionIds = this.getAuthPermissionIds(authProfile);
                const requiredPermissionIds = options.permissionIds.map(Number);

                const canInteract = requiredPermissionIds.some(permissionId =>
                    userPermissionIds.includes(permissionId)
                );

                if (!canInteract) {
                    return next(this.buildForbiddenError(res, this.defaultForbiddenMessage));
                }

                return next();
            } catch (error) {
                return next(error);
            }
        };
    };

    canInteractWithTicket = (options: { permissionIds: number[] }) => {
        return async (req: Request, res: Response, next: NextFunction) => {
            try {
                const authProfile = res.locals.authProfile;

                if (!authProfile) {
                    return next(this.buildUnauthorizedError(res));
                }

                const ticketId = Number(req.params.ticketId);

                const ticketData = await this.ticketsRepository.getTicketById(ticketId);

                if (!ticketData) {
                    return next(this.buildForbiddenError(res, this.defaultForbiddenMessage));
                }

                const userPermissionIds = this.getAuthPermissionIds(authProfile);
                const requiredPermissionIds = options.permissionIds.map(Number);

                const hasGlobalPermission = requiredPermissionIds.some(permissionId =>
                    userPermissionIds.includes(permissionId)
                );

                const ticketsByUser =
                    await this.ticketsUsersRepository.getUsersByTicketId(ticketId) || [];

                const isOwner = ticketsByUser.some(userId =>
                    Number(userId) === Number(authProfile.userId)
                );

                const isAssignedAgent =
                    Number(ticketData.agent?.userId) === Number(authProfile.userId);
                    console.log(ticketData.agent?.userId)
                    console.log(authProfile.userId)

                if (!hasGlobalPermission && !isOwner && !isAssignedAgent) {
                    return next(this.buildForbiddenError(res, this.defaultForbiddenMessage));
                }

                return next();
            } catch (error) {
                return next(error);
            }
        };
    };

    private getAuthPermissionIds = (authProfile: any): number[] => {
        return (authProfile.permissions || []).map(Number);
    };

    private buildUnauthorizedError = (res: Response): AppError => {
        const appError = new Error("Unauthorized") as AppError;
        appError.statusCode = 401;
        appError.errorCode = "APP-AUTH-401";
        appError.message = "Unauthorized";
        appError.transactionId = res.locals.transactionId || randomUUID();
        return appError;
    };

    private buildForbiddenError = (res: Response, message: string): AppError => {
        const appError = new Error(message) as AppError;
        appError.statusCode = 403;
        appError.errorCode = "APP-AUTH-403";
        appError.message = message;
        appError.transactionId = res.locals.transactionId || randomUUID();
        return appError;
    };
}