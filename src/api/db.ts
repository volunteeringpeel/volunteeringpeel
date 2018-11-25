/* tslint:disable:no-console no-var-requires variable-name */
import { Sequelize } from 'sequelize-typescript';

const db: {
  sequelize: Sequelize;
  Sequelize: typeof Sequelize;
} = { Sequelize, sequelize: null };

// Setup MySQL
db.sequelize = new Sequelize({
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  dialect: 'mysql',
  database: 'volunteeringpeel',
  dialectOptions: {
    // don't use javascript dates since timezones are handled on the frontend
    dateStrings: true,
  },
  define: {
    freezeTableName: true,
    underscored: true,
    charset: 'utf8mb4',
    timestamps: false,
  },
  // note: not the timezone used by client, just the one that the server is configured with
  timezone: '-04:00',
});

export default db;
