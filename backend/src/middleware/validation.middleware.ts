import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';

export const validateRequest = (schema: ZodSchema) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log('🔍 Validando requisição:', { body: req.body, query: req.query, params: req.params });
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      console.log('✅ Validação OK');
      return next();
    } catch (error) {
      console.error('❌ Erro na validação:', error);
      if (error instanceof ZodError) {
        return res.status(400).json({
          status: 'error',
          message: 'Dados inválidos',
          errors: error.issues.map((e) => ({
            path: e.path.join('.'),
            message: e.message,
          })),
        });
      }
      return next(error);
    }
  };
};