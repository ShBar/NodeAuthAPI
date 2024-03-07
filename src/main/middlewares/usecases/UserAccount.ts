import { NextFunction, Request, Response } from "express";
import { LoginRequest, SignupRequest } from "../../interfaces/SignupRequest";
import logger from "../../logger";
import { UserAccount } from "../../db/models/User";
import { compareSync } from "bcryptjs";
import * as jwt from "jsonwebtoken";

const JWT_SECRET = process.env.SECRET_KEY || "";

export const signup = async (req: Request, res: Response) => {
    try {
        const form = <SignupRequest>req.body;
        const user: any = await UserAccount.create({
            email: form.email,
            password: form.password,
            firstName: form.firstName,
            lastName: form.lastName,
        });

        res.status(201).json({
            id: user.id
        });
    } catch (error) {
        logger.error(error);
        res.status(500).send();
    }
};


export const login = async (req: Request, res: Response) => {
    try {
        const form = <LoginRequest>req.body;
        const user: any = await UserAccount.findOne({
            where: {
                email: form.email
            }
        });

        const isMatch = compareSync(form.password as string, user.password);
        if (isMatch) {
            const token = jwt.sign({
                id: user.id,
            }, JWT_SECRET, {
                expiresIn: '1h'
            });

            res.status(200).json({ token });
        } else {
            res.status(401).json({
                error: "Authentication Failed"
            });
        }

    } catch (error) {
        logger.error(error);
        res.status(500).send();
    }
}

export const checkIfEmailExists = async (req: Request, res: Response, next: NextFunction) => {
    const form = <SignupRequest>req.body;
    const count: any = await UserAccount.count({
        where: {
            email: form.email
        }
    });
    if (count > 0) {
        res.status(400).json({ error: "Account already exists, login instead" })
        return
    }
    next()
}