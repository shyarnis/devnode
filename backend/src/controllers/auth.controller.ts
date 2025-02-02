import { z } from "zod";
import { catchErrors } from "../utils/catchErrors";
import { CREATED } from "../constants/http";
import { createAccount } from "../services/auth.service";
import { setAuthCookies } from "../utils/cookies";

const registerSchema = z
  .object({
    email: z.string().email().min(6).max(255),
    password: z.string().min(6).max(255),
    confirmPassword: z.string().min(6).max(255),
    userAgent: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

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
