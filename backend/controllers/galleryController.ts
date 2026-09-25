import { Request, Response } from 'express';
import { dbStorage } from '../services/dbStorage.ts';
import { AuthRequest } from '../middleware/authMiddleware.ts';
import { logActivity } from '../services/activityService.ts';

export const getGallery = async (req: Request, res: Response) => {
  const { category, search, page = 1, limit = 30 } = req.query;

  const filter: any = {};
  if (!req.headers.authorization) {
    filter.published = true;
  }

  if (category && category !== 'all') {
    filter.category = new RegExp(String(category), 'i');
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

  const totalItems = await dbStorage.count('gallery', filter);
  const data = await dbStorage.find('gallery', filter, {
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

export const createGallery = async (req: AuthRequest, res: Response) => {
  const { title, description, image, category, project, location, year, published } = req.body;

  if (!title || !description || !image) {
    return res.status(400).json({
      success: false,
      message: 'Please provide title, description, and image URL',
    });
  }

  const gal = await dbStorage.create('gallery', {
    title,
    description,
    image,
    category: category || 'Field Missions',
    project: project || '',
    location: location || '',
    year: year || '2025',
    published: published !== undefined ? Boolean(published) : true,
  });

  if (req.user) {
    await logActivity(req.user, 'Gallery Image Added', 'Gallery', String(gal._id || gal.id), title);
  }

  res.status(201).json({
    success: true,
    data: gal,
  });
};

export const updateGallery = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  const existing = await dbStorage.findById('gallery', id);
  if (!existing) {
    return res.status(404).json({ success: false, message: 'Gallery item not found' });
  }

  const updated = await dbStorage.findByIdAndUpdate('gallery', id, req.body);

  if (req.user) {
    await logActivity(req.user, 'Gallery Image Updated', 'Gallery', id, updated?.title);
  }

  res.status(200).json({
    success: true,
    data: updated,
  });
};

export const deleteGallery = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  const item = await dbStorage.findById('gallery', id);
  if (!item) {
    return res.status(404).json({ success: false, message: 'Gallery item not found' });
  }

  await dbStorage.findByIdAndDelete('gallery', id);

  if (req.user) {
    await logActivity(req.user, 'Gallery Image Deleted', 'Gallery', id, item.title);
  }

  res.status(200).json({
    success: true,
    message: 'Gallery item deleted successfully',
  });
};
