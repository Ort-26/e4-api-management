import { AuthTokenPayload } from '../../models/dto/Auth.type';
import { UserDto } from '../../models/dto/UserDto';
import { AssignRes } from '../../models/response/AssignRes';

export interface IUsersService {
  getAllAgents(): Promise<UserDto[]>;
  assignAgentToTicket(ticketId: number, agentId: number, authProfile: AuthTokenPayload): Promise<AssignRes | null>;
}
