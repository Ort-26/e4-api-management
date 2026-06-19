import { Sequelize } from 'sequelize';
import { config } from '.';

export const sequelize = new Sequelize(config.db.name, config.db.user, config.db.password, {
  host: config.db.host,
  port: config.db.port,
  dialect: 'postgres',
  logging: config.db.logging ? console.log : false,
  define: {
    schema: config.db.schema,
    timestamps: false,
    freezeTableName: true,
  },
});

export const connectDatabase = async (): Promise<void> => {
  await sequelize.authenticate();
  console.log('[database] PostgreSQL connection established');
};
