import { Router } from "express";
import { registerController, loginController, logoutController } from "../controllers/auth.controller";

const authRoutes = Router();

// Prefix: /auth
authRoutes.post("/register", registerController);
authRoutes.post("/login", loginController);
authRoutes.get("/logout", logoutController);

export { authRoutes };
