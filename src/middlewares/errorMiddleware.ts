import { Request, Response, NextFunction } from "express";
import CustomError from "../utils/CustomError";

function errorMiddleware(
  err: CustomError | Error,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  console.error(err.stack);

  if (err instanceof CustomError) {
    // Si c'est une erreur personnalisée
    res.status(err.status).json({
      message: err.message,
      errors: err.details || [],
    });
  } else {
    // Pour toute autre erreur
    res.status(500).json({
      message: "Une erreur interne est survenue.",
    });
  }
}

export default errorMiddleware;
