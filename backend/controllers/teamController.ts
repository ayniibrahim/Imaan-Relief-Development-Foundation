import { Request, Response } from 'express';
import { dbStorage } from '../services/dbStorage.ts';
import { AuthRequest } from '../middleware/authMiddleware.ts';
import { logActivity } from '../services/activityService.ts';

export const getTeam = async (req: Request, res: Response) => {
  const filter: any = {};
  if (!req.headers.authorization) {
    filter.published = true;
  }

  const team = await dbStorage.find('team', filter, {
    sort: { order: 1, createdAt: 1 },
  });

  res.status(200).json({
    success: true,
    data: team,
  });
};

export const createTeamMember = async (req: AuthRequest, res: Response) => {
  const { name, position, biography, photo, email, department, socialLinks, order, published } = req.body;

  if (!name || !position || !biography || !photo) {
    return res.status(400).json({
      success: false,
      message: 'Please provide name, position, biography, and photo URL',
    });
  }

  const member = await dbStorage.create('team', {
    name,
    position,
    biography,
    photo,
    email: email || '',
    department: department || 'Leadership & Board',
    socialLinks: socialLinks || {},
    order: Number(order) || 0,
    published: published !== undefined ? Boolean(published) : true,
  });

  if (req.user) {
    await logActivity(req.user, 'Team Member Added', 'Team', String(member._id || member.id), name);
  }

  res.status(201).json({
    success: true,
    data: member,
  });
};

export const updateTeamMember = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  const existing = await dbStorage.findById('team', id);
  if (!existing) {
    return res.status(404).json({ success: false, message: 'Team member not found' });
  }

  const updated = await dbStorage.findByIdAndUpdate('team', id, req.body);

  if (req.user) {
    await logActivity(req.user, 'Team Member Updated', 'Team', id, updated?.name);
  }

  res.status(200).json({
    success: true,
    data: updated,
  });
};

export const deleteTeamMember = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  const member = await dbStorage.findById('team', id);
  if (!member) {
    return res.status(404).json({ success: false, message: 'Team member not found' });
  }

  await dbStorage.findByIdAndDelete('team', id);

  if (req.user) {
    await logActivity(req.user, 'Team Member Deleted', 'Team', id, member.name);
  }

  res.status(200).json({
    success: true,
    message: 'Team member deleted successfully',
  });
};
