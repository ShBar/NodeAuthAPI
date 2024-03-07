import { NextFunction, Request, Response } from 'express';
import { body, validationResult } from 'express-validator'

export const signupValidator = [
    body("email", "Cannot be empty").not().isEmpty(),
    body("email", "Invalid email").isEmail(),
    body("password", "Password must be atleast 6 characters").isLength({ min: 6 }),
    body("password", "Password is weak: At least 1 Uppercase, 1 Lowercase and 1 Special character required").isStrongPassword(),
    body("firstName", "Firstname cannot be empty").not().isEmpty(),
];


export const loginValidator = [
    body("email", "Cannot be empty").not().isEmpty(),
    body("email", "Invalid email").isEmail(),
    body("password", "Password must be atleast 6 characters").isLength({ min: 6 }),
];

export const updateValidator = [
    body("lastName", "Cannot be empty").not().isEmpty(),
];


export const validatorMw = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(422).json({ errors: errors.array() });
        return
    }
    next()
}