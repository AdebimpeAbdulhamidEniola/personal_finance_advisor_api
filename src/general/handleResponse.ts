import { Response } from "express";

export const handleResponse = (
  res: Response,
  statusCode: number,
  message: string,
  data?: unknown
): void => {
  if (data !== undefined) {
    res.status(statusCode).json({
      status: "success",
      message,
      data,
    });

    return;
  }

  res.status(statusCode).json({
    status: "success",
    message,
  });
};
