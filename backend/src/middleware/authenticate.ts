import { RequestHandler } from "express";
import mongoose from "mongoose";
import appAssert from "../utils/appAssert";
import { UNAUTHORIZED } from "../constants/http";
import AppErrorCode from "../constants/appErrorCode";
import { verfiyToken } from "../utils/jwt";

// Define the structure of the JWT payload
interface JwtPayload {
  userId: string;
  sessionId: string;
}

const authenticate: RequestHandler = (req, res, next) => {
  // 1. Get access token from cookies
  const accessToken = req.cookies.accessToken as string | undefined;
  appAssert(
    accessToken,
    UNAUTHORIZED,
    "Not authorized",
    AppErrorCode.InvalidAccessToken
  );

  // 2. Verify token and check payload structure
  const { error, payload } = verfiyToken(accessToken);
  appAssert(
    payload,
    UNAUTHORIZED,
    error === "jwt expired" ? "Token expired" : "Invalid token",
    AppErrorCode.InvalidAccessToken
  );

  // 3. Type-cast the payload to JwtPayload
  const { userId, sessionId } = payload as JwtPayload;

  // 4. Convert string IDs to ObjectId and assign to request
  req.userId = new mongoose.Types.ObjectId(userId);
  req.sessionId = new mongoose.Types.ObjectId(sessionId);

  next();
};

export default authenticate;