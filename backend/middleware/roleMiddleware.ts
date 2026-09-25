import { Response, NextFunction } from 'express';
import { AuthRequest } from './authMiddleware.ts';

export const authorize = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
      });
    }

    if (!roles.includes(req.user.role) && req.user.role !== 'super_admin') {
      return res.status(403).json({
        success: false,
        message: `User role '${req.user.role}' is not authorized to perform this action. Required: ${roles.join(', ')}`,
      });
    }

    next();
  };
};
