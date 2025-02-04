import "dotenv/config";
import express from 'express';
import cors from 'cors';
import cookieParser from "cookie-parser";

import connectDB from './config/db';
import { APP_ORIGIN, NODE_ENV, PORT } from './constants/env';
import { OK } from "./constants/http";
import  errorHandler  from "./middleware/errorHandler";
import { catchErrors } from "./utils/catchErrors";
import { authRoutes } from "./routes/auth.route";
import authenticate from "./middleware/authenticate";
import userRoutes from "./routes/user.route";

const app = express()

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: APP_ORIGIN,
  credentials: true,
}))

app.use(cookieParser());

app.get('/', catchErrors(
  async (req, res, next) => {
  try {
    throw new Error('Something went wrong');
    res.status(OK).send('Hello World');
  } catch (error) {
    next(error);
  }
  }
));

app.use("/auth", authRoutes);
app.use("/user", authenticate, userRoutes);

// error handler
app.use(errorHandler);

app.listen(PORT, async () => {
  // console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`Server is running on port ${PORT} in ${NODE_ENV} environment`);
  await connectDB();
})