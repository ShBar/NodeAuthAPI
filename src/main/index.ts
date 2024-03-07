import { app } from "./app";
import dotenv from "dotenv";
import logger from "./logger";

if (process.env.NODE_ENV !== "production") {
    dotenv.config({ path: `.env${process.env.NODE_ENV !== undefined ? "." + process.env.NODE_ENV: ""}` });
}

const port = process.env.PORT || 3001;
const serviceName = process.env.SERVICE_NAME || "AuthAPIService"

app.listen(port, () => {
    logger.info(`${serviceName} running at port:${port}`);
});
