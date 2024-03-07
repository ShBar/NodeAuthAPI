import { Sequelize, Dialect } from "sequelize";

export interface DbConfig {
    database: string
    user: string
    password: string
    host: string
    dialect: Dialect
}

export const sequelizeConnection = (config: DbConfig) => new Sequelize(config.database, config.user, config.password, {
    host: config.host,
    dialect: config.dialect,
});


/**
 *     
    database: process.env.DB_NAME || "app",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "root",
    host: process.env.DB_HOST || "localhost",
    dialect: <Dialect> "mysql",
 */