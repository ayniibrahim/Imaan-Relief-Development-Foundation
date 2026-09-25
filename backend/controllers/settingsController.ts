import { Request, Response } from 'express';
import { dbStorage } from '../services/dbStorage.ts';
import { AuthRequest } from '../middleware/authMiddleware.ts';
import { logActivity } from '../services/activityService.ts';

export const getSettings = async (req: Request, res: Response) => {
  let settings = await dbStorage.findOne('settings', {});

  if (!settings) {
    const all = await dbStorage.find('settings', {});
    settings = all[0] || null;
  }

  res.status(200).json({
    success: true,
    data: settings,
  });
};

export const updateSettings = async (req: AuthRequest, res: Response) => {
  let settings = await dbStorage.findOne('settings', {});

  if (!settings) {
    const all = await dbStorage.find('settings', {});
    settings = all[0] || null;
  }

  let updated;
  if (settings) {
    updated = await dbStorage.findByIdAndUpdate('settings', String(settings._id || settings.id), req.body);
  } else {
    updated = await dbStorage.create('settings', req.body);
  }

  if (req.user) {
    await logActivity(req.user, 'Website Settings Updated', 'WebsiteSettings', String(updated?._id || updated?.id));
  }

  res.status(200).json({
    success: true,
    data: updated,
  });
};

export const getDashboardStats = async (req: AuthRequest, res: Response) => {
  const [
    totalPrograms,
    totalProjects,
    activeProjects,
    totalStories,
    totalNews,
    totalEvents,
    upcomingEvents,
    totalVolunteers,
    newVolunteers,
    totalDonations,
    newMessages,
    totalMessages,
    recentLogs,
  ] = await Promise.all([
    dbStorage.count('programs', {}),
    dbStorage.count('projects', {}),
    dbStorage.count('projects', { status: 'Active' }),
    dbStorage.count('stories', {}),
    dbStorage.count('news', {}),
    dbStorage.count('events', {}),
    dbStorage.count('events', { status: 'Upcoming' }),
    dbStorage.count('volunteers', {}),
    dbStorage.count('volunteers', { status: 'New' }),
    dbStorage.count('donations', {}),
    dbStorage.count('contact', { status: 'New' }),
    dbStorage.count('contact', {}),
    dbStorage.find('logs', {}, { sort: { createdAt: -1 }, limit: 10 }),
  ]);

  const donations = await dbStorage.find('donations', {});
  const totalAmountRaised = donations.reduce((sum: number, d: any) => sum + (Number(d.amount) || 0), 0);

  res.status(200).json({
    success: true,
    data: {
      totalPrograms,
      totalProjects,
      activeProjects,
      totalStories,
      totalNews,
      totalEvents,
      upcomingEvents,
      totalVolunteers,
      newVolunteers,
      totalDonations,
      newMessages,
      totalMessages,
      totalAmountRaised,
      recentLogs,
    },
  });
};
