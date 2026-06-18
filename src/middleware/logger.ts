import morgan from 'morgan';
import { config } from '../config';

export const requestLogger = morgan(config.env === 'production' ? 'combined' : 'dev');
