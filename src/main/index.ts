import express from "express";
import logger from "./logger";
import userRoutes from './routes/UserRoutes';
import authRoutes from "./routes/AuthRoutes";
import { authenticate } from "./middlewares/common/Auth";
import { syncModels } from "./db/models/User";

const app = express();
const port = process.env.PORT || 3001;
const serviceName = process.env.SERVICE_NAME || "AuthAPIService"

// Initialize Database
syncModels().then(() => {
    logger.info("DB initialized")
    app.use(express.json());

    app.use("/api/v1/auth", authRoutes);
    app.use("/api/v1/user", authenticate, userRoutes);

    app.listen(port, () => {
        logger.info(`${serviceName} running at port:${port}`);
    });
}).catch((error) => {
    logger.error(`Failed to initialize DB: ${error}`);
})