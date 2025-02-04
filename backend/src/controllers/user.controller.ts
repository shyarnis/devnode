import { NOT_FOUND, OK } from "../constants/http";
import User from "../models/user.model";
import appAssert from "../utils/appAssert";
import { catchErrors } from "../utils/catchErrors";

// Description: Get a user by ID
// ROUTE: GET /user
// Access: Private
export const getUserController = catchErrors(async (req, res) => {
  // 1. get user by id
  const user = await User.findById(req.userId);
  appAssert(user, NOT_FOUND, "User not found");

  // 2. return user
  return res.status(OK).json(user.omitPassword());
});
