import { AuthController } from '../controllers/authController';
import { CatalogsController } from '../controllers/catalogsController';
import { MeController } from '../controllers/meController';
import { TicketsController } from '../controllers/ticketsController';
import { UsersController } from '../controllers/usersController';
import { TicketInteractions } from '../middleware/permissions/canInteractWithTicket';
import { AuthRepository } from '../repositories/impl/AuthRepository';
import { CatalogsRepository } from '../repositories/impl/CatalogsRepository';
import { RolesRepository } from '../repositories/impl/RolesRepository';
import { TicketsRepository } from '../repositories/impl/TicketsRepository';
import { TicketsUsersRepository } from '../repositories/impl/TicketsUsersRepository';
import { TicketTransitionRepository } from '../repositories/impl/TicketTransitionRepository';
import { UsersRepository } from '../repositories/impl/UsersRepository';
import { AuthService } from '../services/impl/AuthService';
import { CatalogsService } from '../services/impl/CatalogsService';
import { TicketsService } from '../services/impl/TicketsService';
import { UsersService } from '../services/impl/UsersService';

const repositories = {
  authRepository: new AuthRepository(),
  catalogsRepository: new CatalogsRepository(),
  rolesRepository: new RolesRepository(),
  ticketsRepository: new TicketsRepository(),
  ticketUsersRepository: new TicketsUsersRepository(), 
  ticketTransitionsRepository: new TicketTransitionRepository(),
  usersRepository: new UsersRepository(),
};

const services = {
  authService: new AuthService(repositories.authRepository, repositories.rolesRepository),
  catalogsService: new CatalogsService(repositories.catalogsRepository),
  ticketsService: new TicketsService(
    repositories.ticketsRepository
    ,repositories.ticketTransitionsRepository
    ,repositories.rolesRepository),
  usersService: new UsersService(repositories.usersRepository, repositories.ticketsRepository),
};

const controllers = {
  authController: new AuthController(services.authService),
  catalogsController: new CatalogsController(services.catalogsService),
  ticketsController: new TicketsController(services.ticketsService),
  meController: new MeController(services.ticketsService),
  usersController: new UsersController(services.usersService),
};

const middlewares = {
  ticketInteractions: new TicketInteractions(repositories.rolesRepository
    ,repositories.ticketUsersRepository
    ,repositories.ticketsRepository),
}

export const container = {
  repositories,
  services,
  controllers,
  middlewares,
};
