import { Router } from "express";
import {
  getSessionsController,
  deleteSessionsController,
} from "../controllers/session.controller";

const sessionRoutes = Router();

// Prefix: /sessions
sessionRoutes.get("/", getSessionsController);
sessionRoutes.delete("/:id", deleteSessionsController);

export default sessionRoutes;
