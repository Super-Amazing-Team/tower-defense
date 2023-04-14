import type {SequelizeOptions} from "sequelize-typescript";
import { Sequelize } from "sequelize"

const { POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_DB, POSTGRES_PORT } =
  process.env;

export const sequelizeOptions: SequelizeOptions = {
    host: "localhost",
    port: Number(POSTGRES_PORT),
    username: POSTGRES_USER,
    password: String(POSTGRES_PASSWORD),
    database: POSTGRES_DB,
    dialect: "postgres", // 'mysql', 'sqlite', 'mariadb', 'mssql'
};

// Создаем инстанс Sequelize
export const sequelize = new Sequelize(sequelizeOptions);
