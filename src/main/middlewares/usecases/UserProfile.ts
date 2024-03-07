import { NextFunction, Request, Response } from "express";
import logger from "../../logger";
import { UserAccount } from "../../db/models/User";

export const getProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.body.user;
        const user: any = await UserAccount.findByPk(id);
        res.status(200).json({
            firstName: user.firstName,
            lastName: user.lastName,
        });
    } catch (error) {
        logger.error(error);
        res.status(500).send();
    }
};


export const updateProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { lastName, user } = req.body;
        await UserAccount.update({ lastName }, {
            where: {
                id: user.id
            }
        });
        res.status(200).send();
    } catch (error) {
        logger.error(error);
        res.status(500).send();
    }
};
