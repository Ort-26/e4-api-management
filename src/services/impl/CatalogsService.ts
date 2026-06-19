import { CatTicketStatuses } from '../../models/domain/cat-ticket-statuses.type';
import { ICatalogsRepository } from '../../repositories/interfaces/ICatalogsRepository';
import { ICatalogsService } from '../interfaces/ICatalogsService'; 
 

export class CatalogsService implements ICatalogsService {
  private catalogsRepository: ICatalogsRepository;

  constructor(catalogsRepository: ICatalogsRepository) {
    this.catalogsRepository = catalogsRepository;
  }

  async getAllTicketStatuses(): Promise<CatTicketStatuses[]> {
    return await this.catalogsRepository.getAllTicketStatuses();
  }
}