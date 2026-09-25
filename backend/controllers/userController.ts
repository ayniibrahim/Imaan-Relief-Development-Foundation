import { Response } from 'express';
import bcrypt from 'bcryptjs';
import { dbStorage } from '../services/dbStorage.ts';
import { AuthRequest } from '../middleware/authMiddleware.ts';
import { logActivity } from '../services/activityService.ts';

export const getUsers = async (req: AuthRequest, res: Response) => {
  const users = await dbStorage.find('users', {}, { sort: { createdAt: -1 } });

  // Exclude password hashes
  const safeUsers = users.map((u: any) => ({
    id: String(u._id || u.id),
    name: u.name,
    email: u.email,
    role: u.role,
    isActive: u.isActive !== false,
    lastLogin: u.lastLogin,
    createdAt: u.createdAt,
  }));

  res.status(200).json({
    success: true,
    data: safeUsers,
  });
};

export const createUser = async (req: AuthRequest, res: Response) => {
  const { name, email, password, role = 'editor', isActive = true } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Please provide name, email, and password',
    });
  }

  if (password.length < 6) {
    return res.status(400).json({
      success: false,
      message: 'Password must be at least 6 characters long',
    });
  }

  const existing = await dbStorage.findOne('users', { email: email.toLowerCase().trim() });
  if (existing) {
    return res.status(400).json({
      success: false,
      message: 'A user with this email address already exists',
    });
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await dbStorage.create('users', {
    name,
    email: email.toLowerCase().trim(),
    password: hashedPassword,
    role,
    isActive: Boolean(isActive),
  });

  if (req.user) {
    await logActivity(req.user, 'Admin User Created', 'User', String(user._id || user.id), `${name} (${role})`);
  }

  res.status(201).json({
    success: true,
    data: {
      id: String(user._id || user.id),
      name: user.name,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
      createdAt: user.createdAt,
    },
  });
};

export const updateUser = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { name, email, role, isActive, password } = req.body;

  const existing = await dbStorage.findById('users', id);
  if (!existing) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }

  const updateData: any = {};
  if (name) updateData.name = name;
  if (email) updateData.email = email.toLowerCase().trim();
  if (role) updateData.role = role;
  if (isActive !== undefined) updateData.isActive = Boolean(isActive);

  if (password && password.trim().length >= 6) {
    const salt = await bcrypt.genSalt(10);
    updateData.password = await bcrypt.hash(password, salt);
  }

  const updated = await dbStorage.findByIdAndUpdate('users', id, updateData);

  if (req.user) {
    await logActivity(req.user, 'Admin User Updated', 'User', id, updated?.name);
  }

  res.status(200).json({
    success: true,
    data: {
      id: String(updated._id || updated.id),
      name: updated.name,
      email: updated.email,
      role: updated.role,
      isActive: updated.isActive,
      createdAt: updated.createdAt,
    },
  });
};

export const deleteUser = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  if (req.user?.id === id) {
    return res.status(400).json({
      success: false,
      message: 'You cannot delete your own administrative account',
    });
  }

  const existing = await dbStorage.findById('users', id);
  if (!existing) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }

  await dbStorage.findByIdAndDelete('users', id);

  if (req.user) {
    await logActivity(req.user, 'Admin User Deleted', 'User', id, existing.name);
  }

  res.status(200).json({
    success: true,
    message: 'User removed successfully',
  });
};
