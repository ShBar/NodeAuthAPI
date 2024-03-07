import express from "express";
import logger from "./logger";
import dotenv from "dotenv";
import userRoutes from './routes/UserRoutes';
import authRoutes from "./routes/AuthRoutes";
import { authMw } from "./middlewares/common/Auth";
import { syncModels } from "./db/models/User";
import { sequelizeConnection } from "./db/Connection";
import { Dialect } from "sequelize";

if (process.env.NODE_ENV !== "production") {
    dotenv.config({ path: `.env${process.env.NODE_ENV !== undefined ? "." + process.env.NODE_ENV: ""}` });
}

logger.info(`ENV: ${process.env.NODE_ENV}`);

const connection = sequelizeConnection({
    database: process.env.DB_NAME || "",
    user: process.env.DB_USER || "",
    password: process.env.DB_PASSWORD || "",
    host: process.env.DB_HOST || "",
    dialect: process.env.DB_DIALECT as Dialect,
});

const app = express();

// Initialize Database
syncModels(connection).then(() => {
    logger.info("DB initialized")
}).catch((error) => {
    logger.error(`Failed to initialize DB: ${error}`);
})

app.use(express.json());

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/user", authMw, userRoutes);


export { app };
