import { Sequelize, Dialect } from "sequelize";
import logger from "../logger";

const config = {
    database: process.env.DB_NAME || "",
    user: process.env.DB_USER || "",
    password: process.env.DB_PASSWORD || "",
    host: process.env.DB_HOST || "",
    dialect: <Dialect> "mysql",
}

logger.info(`DB Config: ${JSON.stringify(config)}`);

export const sequelizeConnection = new Sequelize(config.database, config.user, config.password, {
    host: config.host,
    dialect: config.dialect,
});
