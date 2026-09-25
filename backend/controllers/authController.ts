import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { dbStorage } from '../services/dbStorage.ts';
import { generateToken } from '../utils/generateToken.ts';
import { logActivity } from '../services/activityService.ts';
import { AuthRequest } from '../middleware/authMiddleware.ts';

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Please provide email and password',
    });
  }

  const user = await dbStorage.findOne('users', { email: email.toLowerCase().trim() });

  if (!user) {
    return res.status(401).json({
      success: false,
      message: 'Invalid credentials',
    });
  }

  if (user.isActive === false) {
    return res.status(401).json({
      success: false,
      message: 'Your account has been deactivated. Please contact an administrator.',
    });
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return res.status(401).json({
      success: false,
      message: 'Invalid credentials',
    });
  }

  // Update last login
  await dbStorage.findByIdAndUpdate('users', String(user._id || user.id), {
    lastLogin: new Date().toISOString(),
  });

  const token = generateToken(String(user._id || user.id), user.role);

  // Log activity
  await logActivity(
    { id: String(user._id || user.id), name: user.name, email: user.email, role: user.role },
    'Admin Login',
    'User',
    String(user._id || user.id),
    `Successful login from ${req.ip || 'remote'}`
  );

  res.status(200).json({
    success: true,
    token,
    user: {
      id: String(user._id || user.id),
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
    },
  });
};

export const getMe = async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: 'Not authorized' });
  }

  const user = await dbStorage.findById('users', req.user.id);
  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }

  res.status(200).json({
    success: true,
    data: {
      id: String(user._id || user.id),
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      createdAt: user.createdAt,
      lastLogin: user.lastLogin,
    },
  });
};

export const logout = async (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'Logged out successfully',
  });
};

export const updatePassword = async (req: AuthRequest, res: Response) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({
      success: false,
      message: 'Please provide current and new password',
    });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({
      success: false,
      message: 'New password must be at least 6 characters long',
    });
  }

  const user = await dbStorage.findById('users', req.user!.id);
  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }

  const isMatch = await bcrypt.compare(currentPassword, user.password);
  if (!isMatch) {
    return res.status(400).json({
      success: false,
      message: 'Current password is incorrect',
    });
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(newPassword, salt);

  await dbStorage.findByIdAndUpdate('users', req.user!.id, {
    password: hashedPassword,
  });

  await logActivity(req.user!, 'Password Changed', 'User', req.user!.id);

  res.status(200).json({
    success: true,
    message: 'Password updated successfully',
  });
};
