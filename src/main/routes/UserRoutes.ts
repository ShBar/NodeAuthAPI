import { Router } from "express";
import { getProfile, updateProfile } from "../middlewares/usecases/UserProfile";
import { updateValidator, validatorMw } from "../middlewares/common/Validators";

const userRoutes = Router();

userRoutes.get("/profile", getProfile);

userRoutes.put("/profile", updateValidator, validatorMw, updateProfile);

export default userRoutes;