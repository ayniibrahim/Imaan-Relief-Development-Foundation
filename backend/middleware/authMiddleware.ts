import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { dbStorage } from '../services/dbStorage.ts';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    name: string;
    email: string;
    role: 'super_admin' | 'editor' | 'content_manager';
  };
}

export const protect = async (req: AuthRequest, res: Response, next: NextFunction) => {
  let token: string | undefined;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route. Please log in.',
    });
  }

  try {
    const secret = process.env.JWT_SECRET || 'imaan-relief-super-secret-jwt-key-2025';
    const decoded: any = jwt.verify(token, secret);

    const user = await dbStorage.findById('users', decoded.id);

    if (!user || user.isActive === false) {
      return res.status(401).json({
        success: false,
        message: 'The user belonging to this token no longer exists or is deactivated.',
      });
    }

    req.user = {
      id: String(user._id || user.id),
      name: user.name,
      email: user.email,
      role: user.role,
    };

    next();
  } catch (error: any) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token. Please log in again.',
    });
  }
};
