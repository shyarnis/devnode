import { Router } from "express";
import {
  registerController,
  loginController,
  logoutController,
  refreshController,
  verifyEmailController,
  sendPassswordResetController,
  resetPassswordController,
} from "../controllers/auth.controller";

const authRoutes = Router();

// Prefix: /auth
authRoutes.post("/register", registerController);
authRoutes.post("/login", loginController);
authRoutes.get("/logout", logoutController);
authRoutes.get("/refresh", refreshController);
authRoutes.get("/email/verify/:code", verifyEmailController);
authRoutes.post("/password/forgot", sendPassswordResetController);
authRoutes.post("/password/reset", resetPassswordController);

export { authRoutes };
