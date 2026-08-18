import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth.js';

export function adminOnly(req: AuthRequest, res: Response, next: NextFunction) {
  if (req.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
}