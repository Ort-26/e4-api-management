import { UserDto } from '../../models/dto/UserDto';

export interface IUsersRepository {
  getAllAgents(): Promise<UserDto[]>;
}
