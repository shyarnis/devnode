import { catchErrors } from "../utils/catchErrors";
import { CREATED, OK, UNAUTHORIZED } from "../constants/http";
import {
  createAccount,
  loginUser,
  refreshUserAccessToken,
  verifyEmail
} from "../services/auth.service";
import {
  clearAuthCookies,
  getAccessTokenCookieOptions,
  getRefreshTokenCookieOptions,
  setAuthCookies,
} from "../utils/cookies";
import {
  registerSchema,
  loginSchema,
  verificationCodeSchema,
} from "./auth.schemas";
import SessionModel from "../models/session.model";
import { verfiyToken } from "../utils/jwt";
import appAssert from "../utils/appAssert";

// Decscription: Register a new user
// Route: POST /auth/register
// Access: Public
export const registerController = catchErrors(async (req, res) => {
  // 1. validate request
  const request = registerSchema.parse({
    ...req.body,
    userAgent: req.headers["user-agent"],
  });

  //2.  call service
  const { user, accessToken, refreshToken } = await createAccount(request);

  // 3. set cookies
  setAuthCookies({res, accessToken, refreshToken});

  //4.  return response
  return res.status(CREATED).send({ user });

  // return setAuthCookies({ res, accessToken, refreshToken }).status(CREATED).send({ user });
});

// Description: Login a user
// Route: POST /auth/login
// Access: Public
export const loginController = catchErrors(async (req, res) => {
  // 1. validate request
  const request = loginSchema.parse({
    ...req.body,
    userAgent: req.headers["user-agent"],
  });

  // 2. call service
  const { accessToken, refreshToken } = await loginUser(request);

  // 3. set cookies
  setAuthCookies({ res, accessToken, refreshToken });

  //4.  return response
  return res.status(OK).json({ message: "Login successful" });
});

// Description: Logout a user
// Route: GET /auth/logout
// Access: Private
export const logoutController = catchErrors(async (req, res) => {
  // 1. extract access token from cookies
  const accessToken = req.cookies.accessToken as string | undefined;

  // 2. verify access token
  const { payload, } = verfiyToken(accessToken || "");

  // 3. remove session from database
  if (payload) {
    await SessionModel.findByIdAndDelete(payload.sessionId);
  }

  // 4. clear authentication cookies
  clearAuthCookies(res)

  // 5. return response
  res.status(OK).json({ message: "Logout Successfully" });
});

// Description: Refresh a token
// Route: GET /auth/refresh
// Access: Private
export const refreshController = catchErrors(async (req, res) => {
  // 1. get refresh token from cookies
  const refreshToken = req.cookies.refreshToken as string | undefined;

  // 2. validate that refresh token exists
  appAssert(refreshToken, UNAUTHORIZED, "Missing refresh token");

  // 3. create service: refresh user access token
  const { accessToken, newRefreshToken } = await refreshUserAccessToken(
    refreshToken
  );

  // 4. generate new refresh token
  if (newRefreshToken) {
    res.cookie("refreshToken", newRefreshToken, getRefreshTokenCookieOptions());
  }

  // 4. return response
  return res
    .status(OK)
    .cookie("accessToken", accessToken, getAccessTokenCookieOptions())
    .json({
      message: "Access token refreshed",
    });
});

// Description: Verify Email
// Route: GET /auth/email/verify/:code
// Access: Private
export const verifyEmailController = catchErrors(async (req, res) => {
  // 1. get verification code from request
  const verificationCode = verificationCodeSchema.parse(req.params.code)

  // 2. call service: verfiy email
  await verifyEmail(verificationCode)

  // 3. return response
  return res.status(OK).json({messsage: "Email was successfully verified"})
})