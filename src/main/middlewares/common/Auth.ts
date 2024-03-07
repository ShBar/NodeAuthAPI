import { Request, Response, NextFunction } from 'express';
import * as jwt from "jsonwebtoken";
import logger from '../../logger';
import dotenv from "dotenv";

if (process.env.NODE_ENV !== "production") {
    dotenv.config({ path: `.env${process.env.NODE_ENV !== undefined ? "." + process.env.NODE_ENV: ""}` });
}

const secret = process.env.SECRET_KEY || "";

export const authMw = (req: Request, res: Response, next: NextFunction) => {
    const token = req.header("Authorization")?.split(" ")[1];
    if (!token) {
        return res.status(401);
    }
    jwt.verify(token, secret, (error, user) => {
        if (error) {
            logger.error(error);
            return res.status(403).json({
                error: "Invalid token"
            });
        }

        req.body.user = user;
        next();
    });
};