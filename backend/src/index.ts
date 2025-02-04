import "dotenv/config";
import express from 'express';
import cors from 'cors';
import cookieParser from "cookie-parser";

import connectDB from './config/db';
import { APP_ORIGIN, NODE_ENV, PORT } from './constants/env';
import  errorHandler  from "./middleware/errorHandler";
import { authRoutes } from "./routes/auth.route";
import authenticate from "./middleware/authenticate";
import userRoutes from "./routes/user.route";
import sessionRoutes from "./routes/session.route";

const app = express()

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: APP_ORIGIN,
  credentials: true,
}))

app.use(cookieParser());

app.use("/auth", authRoutes);
app.use("/user", authenticate, userRoutes);
app.use("/sessions", authenticate, sessionRoutes);

// error handler
app.use(errorHandler);

app.listen(PORT, async () => {
  // console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`Server is running on port ${PORT} in ${NODE_ENV} environment`);
  await connectDB();
})