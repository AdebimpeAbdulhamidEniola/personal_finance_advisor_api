// src/middleware/errorHandler.ts
import { NextFunction, Request, Response } from "express";
import { handleAllErrors } from "../utils/errorHandler";

const errorHandling = (
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (res.headersSent) {
    return next(err);
  }

  handleAllErrors(err, res);
};

export default errorHandling;
