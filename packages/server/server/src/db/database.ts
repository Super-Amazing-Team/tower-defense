import type {SequelizeOptions} from "sequelize-typescript";
import { Sequelize } from "sequelize"

const { POSTGRES_HOST, POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_DB, POSTGRES_PORT } =
  process.env;

export const sequelizeOptions: SequelizeOptions = {
    host: `${POSTGRES_HOST || "localhost"}`,
    port: Number(POSTGRES_PORT),
    username: POSTGRES_USER,
    password: `${POSTGRES_PASSWORD}`,
    database: POSTGRES_DB,
    dialect: "postgres", // 'mysql', 'sqlite', 'mariadb', 'mssql'
};

// Создаем инстанс Sequelize
export const sequelize = new Sequelize(sequelizeOptions);
