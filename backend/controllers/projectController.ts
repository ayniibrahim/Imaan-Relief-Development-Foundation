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

export const getProjects = async (req: Request, res: Response) => {
  const { program, status, location, search, published, page = 1, limit = 20 } = req.query;

  const filter: any = {};

  if (published !== undefined) {
    filter.published = published === 'true';
  } else if (!req.headers.authorization) {
    filter.published = true;
  }

  if (program && program !== 'all') {
    filter.program = program;
  }

  if (status && status !== 'all') {
    filter.status = status;
  }

  if (location && location !== 'all') {
    filter.location = new RegExp(String(location), 'i');
  }

  if (search) {
    filter.$or = [
      { title: new RegExp(String(search), 'i') },
      { shortDescription: new RegExp(String(search), 'i') },
      { location: new RegExp(String(search), 'i') },
    ];
  }

  const p = Math.max(1, parseInt(String(page)));
  const l = Math.min(100, Math.max(1, parseInt(String(limit))));
  const skip = (p - 1) * l;

  const totalItems = await dbStorage.count('projects', filter);
  const data = await dbStorage.find('projects', filter, {
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

export const getProjectBySlugOrId = async (req: Request, res: Response) => {
  const { identifier } = req.params;

  let project = await dbStorage.findOne('projects', { slug: identifier });
  if (!project) {
    project = await dbStorage.findById('projects', identifier);
  }

  if (!project) {
    return res.status(404).json({
      success: false,
      message: 'Project not found',
    });
  }

  // Load associated program information
  let associatedProgram = null;
  if (project.program) {
    associatedProgram = await dbStorage.findOne('programs', { slug: project.program });
    if (!associatedProgram) {
      associatedProgram = await dbStorage.findById('programs', project.program);
    }
  }

  res.status(200).json({
    success: true,
    data: {
      ...project,
      associatedProgram,
    },
  });
};

export const createProject = async (req: AuthRequest, res: Response) => {
  const {
    title,
    shortDescription,
    description,
    location,
    startDate,
    endDate,
    status,
    targetBeneficiaries,
    beneficiariesReached,
    program,
    featured,
    coverImage,
    images,
    objectives,
    activities,
    results,
    budgetGoal,
    fundsRaised,
    published,
  } = req.body;

  if (!title || !shortDescription || !description || !location || !program || !coverImage) {
    return res.status(400).json({
      success: false,
      message: 'Please provide all required fields (title, shortDescription, description, location, program, coverImage)',
    });
  }

  let slug = req.body.slug ? createSlug(req.body.slug) : createSlug(title);
  const existing = await dbStorage.findOne('projects', { slug });
  if (existing) {
    slug = `${slug}-${Date.now().toString().slice(-4)}`;
  }

  const proj = await dbStorage.create('projects', {
    title,
    slug,
    shortDescription,
    description,
    location,
    startDate: startDate || '',
    endDate: endDate || '',
    status: status || 'Active',
    targetBeneficiaries: targetBeneficiaries || '',
    beneficiariesReached: beneficiariesReached || '',
    program,
    featured: Boolean(featured),
    coverImage,
    images: Array.isArray(images) ? images : (images ? [images] : [coverImage]),
    objectives: Array.isArray(objectives) ? objectives : (objectives ? objectives.split('\n').filter(Boolean) : []),
    activities: Array.isArray(activities) ? activities : (activities ? activities.split('\n').filter(Boolean) : []),
    results: Array.isArray(results) ? results : (results ? results.split('\n').filter(Boolean) : []),
    budgetGoal: Number(budgetGoal) || 0,
    fundsRaised: Number(fundsRaised) || 0,
    published: published !== undefined ? Boolean(published) : true,
  });

  if (req.user) {
    await logActivity(req.user, 'Project Created', 'Project', String(proj._id || proj.id), title);
  }

  res.status(201).json({
    success: true,
    data: proj,
  });
};

export const updateProject = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  const existing = await dbStorage.findById('projects', id);
  if (!existing) {
    return res.status(404).json({ success: false, message: 'Project not found' });
  }

  const updateData = { ...req.body };
  if (updateData.title && !updateData.slug) {
    updateData.slug = createSlug(updateData.title);
  }

  if (typeof updateData.objectives === 'string') {
    updateData.objectives = updateData.objectives.split('\n').filter(Boolean);
  }
  if (typeof updateData.activities === 'string') {
    updateData.activities = updateData.activities.split('\n').filter(Boolean);
  }
  if (typeof updateData.results === 'string') {
    updateData.results = updateData.results.split('\n').filter(Boolean);
  }

  const updated = await dbStorage.findByIdAndUpdate('projects', id, updateData);

  if (req.user) {
    await logActivity(req.user, 'Project Updated', 'Project', id, updated?.title);
  }

  res.status(200).json({
    success: true,
    data: updated,
  });
};

export const deleteProject = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  const project = await dbStorage.findById('projects', id);
  if (!project) {
    return res.status(404).json({ success: false, message: 'Project not found' });
  }

  await dbStorage.findByIdAndDelete('projects', id);

  if (req.user) {
    await logActivity(req.user, 'Project Deleted', 'Project', id, project.title);
  }

  res.status(200).json({
    success: true,
    message: 'Project deleted successfully',
  });
};
