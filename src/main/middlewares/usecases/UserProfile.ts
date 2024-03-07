import { Request, Response } from "express";
import logger from "../../logger";
import { UserRepo } from "../../repositories/UserRepo";

export const getProfile = async (req: Request, res: Response) => {
    try {
        const { id } = req.body.user;

        const user: any = await UserRepo.getUserById(id);

        res.status(200).json({
            firstName: user.firstName,
            lastName: user.lastName,
        });
    } catch (error) {
        logger.error(error);
        res.status(500).send();
    }
};


export const updateProfile = async (req: Request, res: Response) => {
    try {
        const { lastName, user } = req.body;
        
        await UserRepo.updateUserLastName(user.id, lastName);

        res.status(200).send();
    } catch (error) {
        logger.error(error);
        res.status(500).send();
    }
};
