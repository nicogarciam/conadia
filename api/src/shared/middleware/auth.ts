import { Request, Response, NextFunction } from 'express';
import { supabase } from '../config/supabase';
import { AppError } from './error-handler';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError('Missing or invalid authorization header');
    }

    const token = authHeader.substring(7);
    
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      throw new AppError('Invalid or expired token', 401);
    }

    req.user = {
      id: user.id,
      email: user.email || '',
      role: user.user_metadata?.role || 'owner',
    };

    next();
  } catch (error) {
    next(error);
  }
};
