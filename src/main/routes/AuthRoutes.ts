import { Router } from "express";
import { loginValidator, signupValidator } from "../middlewares/common/Validators";
import { signup, login } from "../middlewares/usecases/UserAccount";

const authRoutes = Router();

authRoutes.post('/signup', signupValidator, signup);

authRoutes.post("/login", loginValidator, login);

export default authRoutes;