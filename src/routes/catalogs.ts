import { Router } from 'express';
import { CatalogsController } from '../controllers/catalogsController';
import { catalogsRepository } from '../repositories/impl/CatalogsRepository';

const router = Router();
const catalogsController = new CatalogsController(catalogsRepository);

router.get('/ticket-status', catalogsController.getAllTicketStatuses);

export default router;
