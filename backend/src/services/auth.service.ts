import jwt, { sign } from "jsonwebtoken";
import VerificationCodeType from "../constants/verificationCodeType";
import SessionModel from "../models/session.model";
import User from "../models/user.model";
import VerificationCodeModel from "../models/verificationCode.model";
import { ONE_DAY_MS, oneYearFromNow, thirtyDaysFromNow } from "../utils/date";
import { JWT_REFRESH_SECRET, JWT_SECRET } from "../constants/env";
import appAssert from "../utils/appAssert";
import { CONFLICT, UNAUTHORIZED } from "../constants/http";
import { RefreshTokenPayload, refreshTokenSignOptions, signToken, verfiyToken } from "../utils/jwt";

export type CreateAccountParams = {
  email: string;
  password: string;
  userAgent?: string;
};

type LoginParams = {
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

  const sessionInfo = {
    sessionId: session._id
  }

  // 6. sign access token & refresh token
  const accessToken = signToken(
    {
      ...sessionInfo,
      userId: user._id,
    }
  )
  // const accessToken = jwt.sign(
  //   {
  //     userId: user._id,
  //     sessionId: session._id,
  //   },
  //   JWT_SECRET,
  //   { expiresIn: "15m", audience: ["user"] }
  // );

  const refreshToken = signToken(sessionInfo, refreshTokenSignOptions)

  // const refreshToken = jwt.sign(
  //   { sessionId: session._id },
  //   JWT_REFRESH_SECRET,
  //   { expiresIn: "30d", audience: ["user"] }
  // );

  // 7. return user & tokens
  return {
    user: user.omitPassword(),
    accessToken,
    refreshToken,
  };
};

// login User
export const loginUser = async (data: LoginParams) => {
  // 1. verify user exists
  const user = await User.findOne({ email: data.email });
  appAssert(user, UNAUTHORIZED, "Invalid email or password");

  // 2. validate password from the request
  const isValid = await user.comparePassword(data.password);
  appAssert(isValid, UNAUTHORIZED, "Invalid email or password");

  // 3. create the session
  const userId = user._id;
  const session = await SessionModel.create({
    userId,
    userAgent: data.userAgent,
  });
  
  const sessionInfo = {
    sessionId: session._id,
  };

  // 4. sign access token & refresh token
  const accessToken = signToken({
    ...sessionInfo,
    userId: user._id,
  })

  const refreshToken = signToken(sessionInfo, refreshTokenSignOptions)

  // 5. return user and tokens
  return {
    user: user.omitPassword(),
    accessToken,
    refreshToken,
  };
};

export const refreshUserAccessToken = async (refreshToken: string) => {
  // validate refresh token
  const { payload } = verfiyToken<RefreshTokenPayload>(refreshToken, {
    secret: refreshTokenSignOptions.secret,
  });
  appAssert(payload, UNAUTHORIZED, "Invalid refresh token ");

  // find corressponding session in database
  const session = await SessionModel.findById(payload.sessionId);
  // ensure session is active
  const now = Date.now();
  appAssert(
    session && session.expiresAt.getTime() > now,
    UNAUTHORIZED,
    "Session expired"
  );

  // determine if session needs to be refreshed
  const sessionNeedsRefresh = session.expiresAt.getTime() - now <= ONE_DAY_MS;

  // extend session expiry if needed
  if (sessionNeedsRefresh) {
    session.expiresAt = thirtyDaysFromNow();
    await session.save();
  }

  const accessToken = signToken({
    userId: session.userId,
    sessionId: session._id,
  });

  const newRefreshToken = sessionNeedsRefresh
    ? signToken(
        {
          sessionId: session._id,
        },
        refreshTokenSignOptions
      )
    : undefined;

  return {
    accessToken,
    newRefreshToken,
  };
};
