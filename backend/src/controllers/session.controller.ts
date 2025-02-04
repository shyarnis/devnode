import { z } from "zod";
import { NOT_FOUND, OK } from "../constants/http";
import SessionModel from "../models/session.model";
import { catchErrors } from "../utils/catchErrors";
import appAssert from "../utils/appAssert";

// Description: Get all active session given user from database
// ROUTE: GET /sessions
// Access: Private
export const getSessionsController = catchErrors(async (req, res) => {
  // 1. db query to get sessions
  const sessions = await SessionModel.find(
    {
      userId: req.userId,
      expiresAt: { $gt: new Date() },
    },
    {
      _id: 1,
      userAgent: 1,
      createdAt: 1,
    },
    {
      sort: {
        createdAt: -1,
      },
    }
  );

  // 2. return response
  return res.status(OK).json(
    // mark the current session
    sessions.map((session) => ({
      ...session.toObject(),
      ...(session.id === req.sessionId && {
        isCurrent: true,
      }),
    }))
  );
});

// Description: Delete all active session given user from database
// ROUTE: DELETE /sessions/:id
// Access: Private
export const deleteSessionsController = catchErrors(async (req, res) => {
  // 1. get session ID from parameters named id
  const sessionId = z.string().parse(req.params.id);

  // 2. delete session ID and also check userID
  const deleted = await SessionModel.findOneAndDelete({
    _id: sessionId,
    userId: req.userId,
  });
  appAssert(deleted, NOT_FOUND, "Session not found");

  // 3. return response
  return res.status(OK).json({
    message: "Session Removed",
  });
});
