import { catchErrors } from "../utils/catchErrors";
import { CREATED, OK } from "../constants/http";
import { createAccount, loginUser } from "../services/auth.service";
import { setAuthCookies } from "../utils/cookies";
import { registerSchema, loginSchema } from "./auth.schemas";

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
  const {accessToken, refreshToken} = await loginUser(request);

  // 3. set cookies
  setAuthCookies({res, accessToken, refreshToken});

  //4.  return response
  return res.status(OK).json({ message: "Login successful" });
}); 