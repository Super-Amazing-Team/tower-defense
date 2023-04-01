import type {SequelizeOptions} from "sequelize-typescript";
import { Sequelize } from "sequelize"

export const sequelizeOptions: SequelizeOptions = {
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "rootroot",
    database: "tower",
    dialect: "postgres", // 'mysql', 'sqlite', 'mariadb', 'mssql'
};

// Создаем инстанс Sequelize
export const sequelize = new Sequelize(sequelizeOptions);
