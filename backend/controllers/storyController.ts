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

export const getStories = async (req: Request, res: Response) => {
  const { search, published, page = 1, limit = 20 } = req.query;

  const filter: any = {};

  if (published !== undefined) {
    filter.published = published === 'true';
  } else if (!req.headers.authorization) {
    filter.published = true;
  }

  if (search) {
    filter.$or = [
      { title: new RegExp(String(search), 'i') },
      { excerpt: new RegExp(String(search), 'i') },
      { content: new RegExp(String(search), 'i') },
      { location: new RegExp(String(search), 'i') },
    ];
  }

  const p = Math.max(1, parseInt(String(page)));
  const l = Math.min(100, Math.max(1, parseInt(String(limit))));
  const skip = (p - 1) * l;

  const totalItems = await dbStorage.count('stories', filter);
  const data = await dbStorage.find('stories', filter, {
    sort: { publishedAt: -1, createdAt: -1 },
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

export const getStoryBySlugOrId = async (req: Request, res: Response) => {
  const { identifier } = req.params;

  let story = await dbStorage.findOne('stories', { slug: identifier });
  if (!story) {
    story = await dbStorage.findById('stories', identifier);
  }

  if (!story) {
    return res.status(404).json({
      success: false,
      message: 'Field story not found',
    });
  }

  res.status(200).json({
    success: true,
    data: story,
  });
};

export const createStory = async (req: AuthRequest, res: Response) => {
  const { title, excerpt, content, image, location, project, program, author, readingTime, featured, published } = req.body;

  if (!title || !excerpt || !content || !image || !location) {
    return res.status(400).json({
      success: false,
      message: 'Please provide all required fields (title, excerpt, content, image, location)',
    });
  }

  let slug = req.body.slug ? createSlug(req.body.slug) : createSlug(title);
  const existing = await dbStorage.findOne('stories', { slug });
  if (existing) {
    slug = `${slug}-${Date.now().toString().slice(-4)}`;
  }

  const story = await dbStorage.create('stories', {
    title,
    slug,
    excerpt,
    content,
    image,
    location,
    project: project || '',
    program: program || '',
    author: author || 'Imaan Field Communications Team',
    readingTime: readingTime || '4 min read',
    featured: Boolean(featured),
    published: published !== undefined ? Boolean(published) : true,
    publishedAt: new Date().toISOString(),
  });

  if (req.user) {
    await logActivity(req.user, 'Story Created', 'Story', String(story._id || story.id), title);
  }

  res.status(201).json({
    success: true,
    data: story,
  });
};

export const updateStory = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  const existing = await dbStorage.findById('stories', id);
  if (!existing) {
    return res.status(404).json({ success: false, message: 'Story not found' });
  }

  const updateData = { ...req.body };
  if (updateData.title && !updateData.slug) {
    updateData.slug = createSlug(updateData.title);
  }

  const updated = await dbStorage.findByIdAndUpdate('stories', id, updateData);

  if (req.user) {
    await logActivity(req.user, 'Story Updated', 'Story', id, updated?.title);
  }

  res.status(200).json({
    success: true,
    data: updated,
  });
};

export const deleteStory = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  const story = await dbStorage.findById('stories', id);
  if (!story) {
    return res.status(404).json({ success: false, message: 'Story not found' });
  }

  await dbStorage.findByIdAndDelete('stories', id);

  if (req.user) {
    await logActivity(req.user, 'Story Deleted', 'Story', id, story.title);
  }

  res.status(200).json({
    success: true,
    message: 'Story deleted successfully',
  });
};
