import { Request, Response } from 'express';
import { dbStorage } from '../services/dbStorage.ts';
import { AuthRequest } from '../middleware/authMiddleware.ts';
import { logActivity } from '../services/activityService.ts';

export const submitVolunteer = async (req: Request, res: Response) => {
  const { fullName, email, phone, location, skills, education, experience, availability, interests, message, cvUrl } = req.body;

  if (!fullName || !email || !phone || !location || !availability || !message) {
    return res.status(400).json({
      success: false,
      message: 'Please fill in all required fields (Full Name, Email, Phone, Location, Availability, Message)',
    });
  }

  const volunteer = await dbStorage.create('volunteers', {
    fullName,
    email: email.toLowerCase().trim(),
    phone,
    location,
    skills: Array.isArray(skills) ? skills : (skills ? skills.split(',').map((s: string) => s.trim()) : []),
    education: education || '',
    experience: experience || '',
    availability,
    interests: Array.isArray(interests) ? interests : (interests ? interests.split(',').map((s: string) => s.trim()) : []),
    message,
    cvUrl: cvUrl || '',
    status: 'New',
    createdAt: new Date().toISOString(),
  });

  res.status(201).json({
    success: true,
    message: 'Thank you for your dedication to humanity! Your volunteer application has been received and our coordination team will review your application shortly.',
    data: volunteer,
  });
};

export const getVolunteers = async (req: AuthRequest, res: Response) => {
  const { status, search, page = 1, limit = 20 } = req.query;

  const filter: any = {};
  if (status && status !== 'all') {
    filter.status = status;
  }

  if (search) {
    filter.$or = [
      { fullName: new RegExp(String(search), 'i') },
      { email: new RegExp(String(search), 'i') },
      { location: new RegExp(String(search), 'i') },
      { message: new RegExp(String(search), 'i') },
    ];
  }

  const p = Math.max(1, parseInt(String(page)));
  const l = Math.min(100, Math.max(1, parseInt(String(limit))));
  const skip = (p - 1) * l;

  const totalItems = await dbStorage.count('volunteers', filter);
  const data = await dbStorage.find('volunteers', filter, {
    sort: { createdAt: -1 },
    skip,
    limit: l,
  });

  res.status(200).json({
    success: true,
    data,
    currentPage: p,
    totalPages: Math.ceil(totalItems / l) || 1,
    totalItems,
  });
};

export const getVolunteerById = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  const volunteer = await dbStorage.findById('volunteers', id);
  if (!volunteer) {
    return res.status(404).json({ success: false, message: 'Volunteer application not found' });
  }

  res.status(200).json({
    success: true,
    data: volunteer,
  });
};

export const updateVolunteer = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { status, notes } = req.body;

  const existing = await dbStorage.findById('volunteers', id);
  if (!existing) {
    return res.status(404).json({ success: false, message: 'Volunteer application not found' });
  }

  const updated = await dbStorage.findByIdAndUpdate('volunteers', id, {
    ...(status && { status }),
    ...(notes !== undefined && { notes }),
    reviewedBy: req.user?.name,
  });

  if (req.user) {
    await logActivity(req.user, 'Volunteer Status Updated', 'Volunteer', id, `Status changed to ${status || existing.status}`);
  }

  res.status(200).json({
    success: true,
    data: updated,
  });
};

export const deleteVolunteer = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  const existing = await dbStorage.findById('volunteers', id);
  if (!existing) {
    return res.status(404).json({ success: false, message: 'Volunteer application not found' });
  }

  await dbStorage.findByIdAndDelete('volunteers', id);

  if (req.user) {
    await logActivity(req.user, 'Volunteer Deleted', 'Volunteer', id, existing.fullName);
  }

  res.status(200).json({
    success: true,
    message: 'Volunteer application deleted',
  });
};
