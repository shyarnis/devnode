import { z } from "zod";
import { Response, ErrorRequestHandler } from "express";
import { BAD_REQUEST, INTERNAL_SERVER_ERROR } from "../constants/http";
import AppError from "../utils/appError";

const handleZodError = (res: Response, error: z.ZodError): void => {
  const errors = error.issues.map((err) => ({
    path: err.path.join("."),
    message: err.message,
  }));

  res.status(BAD_REQUEST).json({
    errors,
    message: error.message,
  });
};

const handleAppError = (res: Response, error: AppError): void => {
  res.status(error.statusCode).json({
    message: error.message,
    errorCode: error.errorCode,
  });
};

const errorHandler: ErrorRequestHandler = (error, req, res, next): void => {
  console.error(`Error in path: ${req.path}`, error);

  if (error instanceof z.ZodError) {
    handleZodError(res, error);
  }

  if (error instanceof AppError) {
    handleAppError(res, error);
  }

  res.status(INTERNAL_SERVER_ERROR).send("Internal server error");
};

export default errorHandler;
