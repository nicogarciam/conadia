import { z } from 'zod';
import { Request, Response, NextFunction } from 'express';

export const validateRequest = <T extends z.ZodTypeAny>(schema: T) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({
          error: {
            message: 'Validation error',
            details: error.errors,
          },
        });
      } else {
        next(error);
      }
    }
  };
};
