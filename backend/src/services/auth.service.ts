import jwt from "jsonwebtoken";
import VerificationCodeType from "../constants/verificationCodeType";
import SessionModel from "../models/session.model";
import User from "../models/user.model";
import VerificationCodeModel from "../models/verificationCode.model";
import { oneYearFromNow } from "../utils/date";
import { JWT_REFRESH_SECRET, JWT_SECRET } from "../constants/env";
import appAssert from "../utils/appAssert";
import { CONFLICT } from "../constants/http";


export type CreateAccountParams = {
  email: string;
  password: string;
  userAgent?: string;
};

export const createAccount = async (data: CreateAccountParams) => {
  // 1. verfiy existing user doesn't exist
  const existingUser = await User.exists({ email: data.email });
  appAssert(!existingUser, CONFLICT, "User already exists");

  // 2. create user
  if (existingUser) {
    throw new Error("User already exists");
  }

  const user = await User.create({
    email: data.email,
    password: data.password,
  });

  // 3. create verficiation code
  const verificationCode = await VerificationCodeModel.create({
    userId: user._id,
    type: VerificationCodeType.EmailVerification,
    expiresAt: oneYearFromNow(),
  });

  // 4. send verification email
  // 5. create session
  const session = await SessionModel.create({
    userId: user._id,
    userAgent: data.userAgent,
  });

  // 6. sign access token & refresh token
  const accessToken = jwt.sign(
    {
      userId: user._id,
      sessionId: session._id,
    },
    JWT_SECRET,
    { expiresIn: "15m", audience: ["user"] }
  );

  const refreshToken = jwt.sign(
    { sessionId: session._id },
    JWT_REFRESH_SECRET,
    { expiresIn: "30d", audience: ["user"] }
  );

  // 7. return user & tokens
  return {
    user: user.omitPassword(),
    accessToken,
    refreshToken,
  };
};
