// src/utils/response.utils.ts
import { Prisma } from "@/lib/prisma"
import { Response } from "express";
import { AppError } from "./error.utils";

export const sendErrorResponse = (
  res: Response,
  statusCode: number,
  message: string
): void => {
  const isServerError = statusCode >= 500;

  res.status(statusCode).json({
    status: isServerError ? "error" : "failed",
    message,
  });
};

export const catchPrismaError = (error: unknown, res: Response): boolean => {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    const prismaError = error as Prisma.PrismaClientKnownRequestError;

    if (prismaError.code === "P2002") {
      const field = (prismaError.meta?.target as string[])?.[0];
      sendErrorResponse(res, 409, `A record with this field already exists: ${field}`);
      return true;
    }

    if (prismaError.code === "P2025") {
      sendErrorResponse(res, 404, "Record not found");
      return true;
    }

    if (prismaError.code === "P2003") {
      sendErrorResponse(res, 400, "Foreign key constraint violation");
      return true;
    }

    if (prismaError.code === "P2014") {
      sendErrorResponse(
        res,
        400,
        "Relation violation - cannot delete or update related records"
      );
      return true;
    }

    if (prismaError.code === "P2021") {
      sendErrorResponse(res, 500, "Database table does not exist");
      return true;
    }

    if (prismaError.code === "P2022") {
      sendErrorResponse(res, 500, "Database column does not exist");
      return true;
    }

    // generic Prisma error (treat as server error)
    sendErrorResponse(res, 500, `Database error: ${prismaError.message}`);
    return true;
  }

  return false;
};

export const handleUnexpectedError = (error: unknown, res: Response): void => {
  console.error("Unexpected error:", error);

  // Always server error → status: "error"
  res.status(500).json({
    status: "error",
    message: "An unexpected error occurred",
  });
};

export const handleAppError = (error: unknown, res: Response): boolean => {
  if (error instanceof AppError) {
    // AppError is user / known side → status: "failed"
    sendErrorResponse(res, error.statusCode, error.message);
    return true;
  }
  return false;
};

export const handleAllErrors = (error: unknown, res: Response): void => {
  if (handleAppError(error, res)) return;
  if (catchPrismaError(error, res)) return;
  handleUnexpectedError(error, res);
};
