import { Router } from "express";
import { getUserController } from "../controllers/user.controller";

const userRouters = Router();

// Prefix: /user
userRouters.get("/", getUserController);

export default userRouters;