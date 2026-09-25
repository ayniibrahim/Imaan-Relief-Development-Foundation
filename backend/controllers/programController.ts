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

export const getPrograms = async (req: Request, res: Response) => {
  const { category, search, published, page = 1, limit = 20 } = req.query;

  const filter: any = {};

  if (published !== undefined) {
    filter.published = published === 'true';
  } else if (!req.headers.authorization) {
    // Default public: only published
    filter.published = true;
  }

  if (category && category !== 'all') {
    filter.category = new RegExp(String(category), 'i');
  }

  if (search) {
    filter.$or = [
      { title: new RegExp(String(search), 'i') },
      { shortDescription: new RegExp(String(search), 'i') },
      { category: new RegExp(String(search), 'i') },
    ];
  }

  const p = Math.max(1, parseInt(String(page)));
  const l = Math.min(100, Math.max(1, parseInt(String(limit))));
  const skip = (p - 1) * l;

  const totalItems = await dbStorage.count('programs', filter);
  const data = await dbStorage.find('programs', filter, {
    sort: { order: 1, createdAt: -1 },
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

export const getProgramBySlugOrId = async (req: Request, res: Response) => {
  const { identifier } = req.params;

  let program = await dbStorage.findOne('programs', { slug: identifier });
  if (!program) {
    program = await dbStorage.findById('programs', identifier);
  }

  if (!program) {
    return res.status(404).json({
      success: false,
      message: 'Program not found',
    });
  }

  // Load related projects
  const relatedProjects = await dbStorage.find('projects', {
    $or: [{ program: program.slug }, { program: String(program._id || program.id) }],
    published: true,
  });

  res.status(200).json({
    success: true,
    data: {
      ...program,
      relatedProjects,
    },
  });
};

export const createProgram = async (req: AuthRequest, res: Response) => {
  const { title, shortDescription, description, image, icon, category, objectives, targetBeneficiaries, locations, status, featured, published, stats } = req.body;

  if (!title || !shortDescription || !description || !image || !category) {
    return res.status(400).json({
      success: false,
      message: 'Please provide all required fields (title, shortDescription, description, image, category)',
    });
  }

  let slug = req.body.slug ? createSlug(req.body.slug) : createSlug(title);
  const existing = await dbStorage.findOne('programs', { slug });
  if (existing) {
    slug = `${slug}-${Date.now().toString().slice(-4)}`;
  }

  const program = await dbStorage.create('programs', {
    title,
    slug,
    shortDescription,
    description,
    image,
    icon: icon || 'category',
    category,
    objectives: Array.isArray(objectives) ? objectives : (objectives ? objectives.split('\n').filter(Boolean) : []),
    targetBeneficiaries: targetBeneficiaries || '',
    locations: Array.isArray(locations) ? locations : (locations ? locations.split(',').map((s: string) => s.trim()) : []),
    status: status || 'active',
    featured: Boolean(featured),
    published: published !== undefined ? Boolean(published) : true,
    stats: Array.isArray(stats) ? stats : [],
    order: 0,
  });

  if (req.user) {
    await logActivity(req.user, 'Program Created', 'Program', String(program._id || program.id), title);
  }

  res.status(201).json({
    success: true,
    data: program,
  });
};

export const updateProgram = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  const existing = await dbStorage.findById('programs', id);
  if (!existing) {
    return res.status(404).json({ success: false, message: 'Program not found' });
  }

  const updateData = { ...req.body };
  if (updateData.title && !updateData.slug) {
    updateData.slug = createSlug(updateData.title);
  } else if (updateData.slug) {
    updateData.slug = createSlug(updateData.slug);
  }

  if (typeof updateData.objectives === 'string') {
    updateData.objectives = updateData.objectives.split('\n').filter(Boolean);
  }
  if (typeof updateData.locations === 'string') {
    updateData.locations = updateData.locations.split(',').map((s: string) => s.trim());
  }

  const updated = await dbStorage.findByIdAndUpdate('programs', id, updateData);

  if (req.user) {
    await logActivity(req.user, 'Program Updated', 'Program', id, updated?.title);
  }

  res.status(200).json({
    success: true,
    data: updated,
  });
};

export const deleteProgram = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  const program = await dbStorage.findById('programs', id);
  if (!program) {
    return res.status(404).json({ success: false, message: 'Program not found' });
  }

  await dbStorage.findByIdAndDelete('programs', id);

  if (req.user) {
    await logActivity(req.user, 'Program Deleted', 'Program', id, program.title);
  }

  res.status(200).json({
    success: true,
    message: 'Program deleted successfully',
  });
};
