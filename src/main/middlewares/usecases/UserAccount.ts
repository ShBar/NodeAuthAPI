import { NextFunction, Request, Response } from "express";
import { LoginRequest, SignupRequest } from "../../interfaces/SignupRequest";
import logger from "../../logger";
import { compareSync } from "bcryptjs";
import * as jwt from "jsonwebtoken";
import { UserRepo } from "../../repositories/UserRepo";

const JWT_SECRET = process.env.SECRET_KEY || "";

export const signup = async (req: Request, res: Response) => {
    try {
        const form = <SignupRequest>req.body;

        const user: any = await UserRepo.createUser(form);

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

        const user: any = await UserRepo.getUserByEmail(form.email as string);

        if(!user) {
            res.status(401).json({
                error: "Authentication Failed: Invalid Email or Password"
            });
            return
        }

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
                error: "Authentication Failed: Invalid Email or Password"
            });
        }

    } catch (error) {
        logger.error(error);
        res.status(500).send();
    }
}

export const checkIfEmailExists = async (req: Request, res: Response, next: NextFunction) => {
    const form = <SignupRequest>req.body;

    const count: number = await UserRepo.checkIfEmailExists(form.email as string);
    logger.info(`Count: ${count}`);
    
    if (count > 0) {
        res.status(400).json({ error: "Account already exists, login instead" })
        return
    }
    next()
}