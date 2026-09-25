import { Request, Response } from 'express';
import { dbStorage } from '../services/dbStorage.ts';
import { AuthRequest } from '../middleware/authMiddleware.ts';
import { logActivity } from '../services/activityService.ts';

function createSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export const getEvents = async (req: Request, res: Response) => {
  const { status, search, published, page = 1, limit = 20 } = req.query;

  const filter: any = {};

  if (published !== undefined) {
    filter.published = published === 'true';
  } else if (!req.headers.authorization) {
    filter.published = true;
  }

  if (status && status !== 'all') {
    filter.status = status;
  }

  if (search) {
    filter.$or = [
      { title: new RegExp(String(search), 'i') },
      { description: new RegExp(String(search), 'i') },
      { location: new RegExp(String(search), 'i') },
    ];
  }

  const p = Math.max(1, parseInt(String(page)));
  const l = Math.min(100, Math.max(1, parseInt(String(limit))));
  const skip = (p - 1) * l;

  const totalItems = await dbStorage.count('events', filter);
  const data = await dbStorage.find('events', filter, {
    sort: { date: 1 },
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

export const getEventBySlugOrId = async (req: Request, res: Response) => {
  const { identifier } = req.params;

  let event = await dbStorage.findOne('events', { slug: identifier });
  if (!event) {
    event = await dbStorage.findById('events', identifier);
  }

  if (!event) {
    return res.status(404).json({
      success: false,
      message: 'Event not found',
    });
  }

  res.status(200).json({
    success: true,
    data: event,
  });
};

export const createEvent = async (req: AuthRequest, res: Response) => {
  const { title, description, image, date, startTime, endTime, location, isVirtual, registrationUrl, status, published } = req.body;

  if (!title || !description || !image || !date || !location) {
    return res.status(400).json({
      success: false,
      message: 'Please provide all required fields (title, description, image, date, location)',
    });
  }

  let slug = req.body.slug ? createSlug(req.body.slug) : createSlug(title);
  const existing = await dbStorage.findOne('events', { slug });
  if (existing) {
    slug = `${slug}-${Date.now().toString().slice(-4)}`;
  }

  const ev = await dbStorage.create('events', {
    title,
    slug,
    description,
    image,
    date,
    startTime: startTime || '',
    endTime: endTime || '',
    location,
    isVirtual: Boolean(isVirtual),
    registrationUrl: registrationUrl || '',
    status: status || 'Upcoming',
    published: published !== undefined ? Boolean(published) : true,
  });

  if (req.user) {
    await logActivity(req.user, 'Event Created', 'Event', String(ev._id || ev.id), title);
  }

  res.status(201).json({
    success: true,
    data: ev,
  });
};

export const updateEvent = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  const existing = await dbStorage.findById('events', id);
  if (!existing) {
    return res.status(404).json({ success: false, message: 'Event not found' });
  }

  const updateData = { ...req.body };
  if (updateData.title && !updateData.slug) {
    updateData.slug = createSlug(updateData.title);
  }

  const updated = await dbStorage.findByIdAndUpdate('events', id, updateData);

  if (req.user) {
    await logActivity(req.user, 'Event Updated', 'Event', id, updated?.title);
  }

  res.status(200).json({
    success: true,
    data: updated,
  });
};

export const deleteEvent = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  const event = await dbStorage.findById('events', id);
  if (!event) {
    return res.status(404).json({ success: false, message: 'Event not found' });
  }

  await dbStorage.findByIdAndDelete('events', id);

  if (req.user) {
    await logActivity(req.user, 'Event Deleted', 'Event', id, event.title);
  }

  res.status(200).json({
    success: true,
    message: 'Event deleted successfully',
  });
};
