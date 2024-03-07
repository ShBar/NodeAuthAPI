import { Router } from "express";
import { loginValidator, signupValidator, validatorMw } from "../middlewares/common/Validators";
import { signup, login, checkIfEmailExists } from "../middlewares/usecases/UserAccount";

const authRoutes = Router();

authRoutes.post('/signup', signupValidator, validatorMw, checkIfEmailExists, signup);

authRoutes.post("/login", loginValidator, validatorMw, login);

export default authRoutes;