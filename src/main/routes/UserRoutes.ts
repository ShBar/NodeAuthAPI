import { Router } from "express";
import { getProfile, updateProfile } from "../middlewares/usecases/UserProfile";

const userRoutes = Router();

userRoutes.get("/profile", getProfile);

userRoutes.put("/profile", updateProfile);

export default userRoutes;