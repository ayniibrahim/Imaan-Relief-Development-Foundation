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

export const getNews = async (req: Request, res: Response) => {
  const { category, search, published, page = 1, limit = 20 } = req.query;

  const filter: any = {};

  if (published !== undefined) {
    filter.published = published === 'true';
  } else if (!req.headers.authorization) {
    filter.published = true;
  }

  if (category && category !== 'all') {
    filter.category = new RegExp(String(category), 'i');
  }

  if (search) {
    filter.$or = [
      { title: new RegExp(String(search), 'i') },
      { excerpt: new RegExp(String(search), 'i') },
      { content: new RegExp(String(search), 'i') },
    ];
  }

  const p = Math.max(1, parseInt(String(page)));
  const l = Math.min(100, Math.max(1, parseInt(String(limit))));
  const skip = (p - 1) * l;

  const totalItems = await dbStorage.count('news', filter);
  const data = await dbStorage.find('news', filter, {
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

export const getNewsBySlugOrId = async (req: Request, res: Response) => {
  const { identifier } = req.params;

  let newsItem = await dbStorage.findOne('news', { slug: identifier });
  if (!newsItem) {
    newsItem = await dbStorage.findById('news', identifier);
  }

  if (!newsItem) {
    return res.status(404).json({
      success: false,
      message: 'News article not found',
    });
  }

  res.status(200).json({
    success: true,
    data: newsItem,
  });
};

export const createNews = async (req: AuthRequest, res: Response) => {
  const { title, excerpt, content, featuredImage, category, author, tags, featured, published } = req.body;

  if (!title || !excerpt || !content || !featuredImage) {
    return res.status(400).json({
      success: false,
      message: 'Please provide all required fields (title, excerpt, content, featuredImage)',
    });
  }

  let slug = req.body.slug ? createSlug(req.body.slug) : createSlug(title);
  const existing = await dbStorage.findOne('news', { slug });
  if (existing) {
    slug = `${slug}-${Date.now().toString().slice(-4)}`;
  }

  const news = await dbStorage.create('news', {
    title,
    slug,
    excerpt,
    content,
    featuredImage,
    category: category || 'Press Release',
    author: author || (req.user ? req.user.name : 'Imaan Press Office'),
    tags: Array.isArray(tags) ? tags : (tags ? tags.split(',').map((t: string) => t.trim()) : []),
    featured: Boolean(featured),
    published: published !== undefined ? Boolean(published) : true,
    publishedAt: new Date().toISOString(),
  });

  if (req.user) {
    await logActivity(req.user, 'News Created', 'News', String(news._id || news.id), title);
  }

  res.status(201).json({
    success: true,
    data: news,
  });
};

export const updateNews = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  const existing = await dbStorage.findById('news', id);
  if (!existing) {
    return res.status(404).json({ success: false, message: 'News article not found' });
  }

  const updateData = { ...req.body };
  if (updateData.title && !updateData.slug) {
    updateData.slug = createSlug(updateData.title);
  }

  const updated = await dbStorage.findByIdAndUpdate('news', id, updateData);

  if (req.user) {
    await logActivity(req.user, 'News Updated', 'News', id, updated?.title);
  }

  res.status(200).json({
    success: true,
    data: updated,
  });
};

export const deleteNews = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  const news = await dbStorage.findById('news', id);
  if (!news) {
    return res.status(404).json({ success: false, message: 'News article not found' });
  }

  await dbStorage.findByIdAndDelete('news', id);

  if (req.user) {
    await logActivity(req.user, 'News Deleted', 'News', id, news.title);
  }

  res.status(200).json({
    success: true,
    message: 'News article deleted successfully',
  });
};
