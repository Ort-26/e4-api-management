import { AuthTokenPayload } from '../../models/dto/Auth.type';
import { UserDto } from '../../models/dto/UserDto';
import { AssignRes } from '../../models/response/AssignRes';
import { ITicketsRepository } from '../../repositories/interfaces/ITicketsRepository';
import { IUsersRepository } from '../../repositories/interfaces/IUsersRepository';
import { IUsersService } from '../interfaces/IUsersService';

export class UsersService implements IUsersService {
    private readonly usersRepository: IUsersRepository
    private readonly ticketsRepository: ITicketsRepository;
    
    constructor(usersRepository: IUsersRepository, ticketsRepository: ITicketsRepository) {
        this.usersRepository = usersRepository;
        this.ticketsRepository = ticketsRepository;
    }

    async getAllAgents(): Promise<UserDto[]> {
        return await this.usersRepository.getAllAgents();
    }

    async assignAgentToTicket(ticketId: number, agentId: number, authProfile: AuthTokenPayload): Promise<AssignRes | null> {
        const ticket = await this.ticketsRepository.getTicketById(ticketId);
        if (!ticket) return null;
        return await this.ticketsRepository.assignAgentToTicket(ticketId, agentId, authProfile.userId);
    }

}
