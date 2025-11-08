import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { JsonWebTokenError } from 'jsonwebtoken';

interface AppError extends Error {
  statusCode?: number;
  status?: string;
  isOperational?: boolean;
}

const handleCastErrorDB = (err: any) => ({
  message: `Invalid ${err.path}: ${err.value}`,
  statusCode: 400
});

const handleDuplicateFieldsDB = (err: any) => ({
  message: `Valor duplicado: ${Object.keys(err.keyValue)}. Por favor use outro valor`,
  statusCode: 400
});

const handleValidationErrorDB = (err: any) => ({
  message: Object.values(err.errors).map((el: any) => el.message).join('. '),
  statusCode: 400
});

const handleJWTError = () => ({
  message: 'Token inválido. Por favor, faça login novamente',
  statusCode: 401
});

const handleJWTExpiredError = () => ({
  message: 'Token expirado. Por favor, faça login novamente',
  statusCode: 401
});

const handleZodError = (err: ZodError) => ({
  message: err.issues.map((error) => error.message).join('. '),
  statusCode: 400
});

const sendErrorDev = (err: AppError, res: Response) => {
  res.status(err.statusCode || 500).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack
  });
};

const sendErrorProd = (err: AppError, res: Response) => {
  // Operational, trusted error: send message to client
  if (err.isOperational) {
    res.status(err.statusCode || 500).json({
      status: err.status,
      message: err.message
    });
  } else {
    // Programming or other unknown error: don't leak error details
    console.error('ERROR 💥', err);
    res.status(500).json({
      status: 'error',
      message: 'Algo deu errado!'
    });
  }
};

export const errorHandler = (err: any, _req: Request, res: Response, _next: NextFunction) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else {
    let error = { ...err };
    error.message = err.message;

    if (err.name === 'CastError') error = handleCastErrorDB(err);
    if (err.code === 11000) error = handleDuplicateFieldsDB(err);
    if (err.name === 'ValidationError') error = handleValidationErrorDB(err);
    if (err instanceof JsonWebTokenError) error = handleJWTError();
    if (err.name === 'TokenExpiredError') error = handleJWTExpiredError();
    if (err instanceof ZodError) error = handleZodError(err);

    sendErrorProd(error, res);
  }
};