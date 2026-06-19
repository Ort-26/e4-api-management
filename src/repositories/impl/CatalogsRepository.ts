import { CatTicketStatuses } from '../../models/domain/cat-ticket-statuses.type';
import { CatTicketStatusesModel } from '../../models/sequelize/CatTicketStatusesModel';
import { ICatalogsRepository } from '../interfaces/ICatalogsRepository';



export class CatalogsRepository implements ICatalogsRepository {
	async getAllTicketStatuses(): Promise<CatTicketStatuses[]> {
		const records = await CatTicketStatusesModel.findAll({
			order: [['statusId', 'ASC']],
		});

		return records.map((record) => record.get({ plain: true }));
	}
}

export const catalogsRepository = new CatalogsRepository();
