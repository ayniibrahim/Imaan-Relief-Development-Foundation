import { Request, Response } from 'express';
import { dbStorage } from '../services/dbStorage.ts';
import { AuthRequest } from '../middleware/authMiddleware.ts';
import { logActivity } from '../services/activityService.ts';

export const submitContact = async (req: Request, res: Response) => {
  const { name, email, phone, subject, message } = req.body;

  if (!name || !email || !subject || !message) {
    return res.status(400).json({
      success: false,
      message: 'Please provide name, email, subject, and message',
    });
  }

  const contact = await dbStorage.create('contact', {
    name,
    email: email.toLowerCase().trim(),
    phone: phone || '',
    subject,
    message,
    status: 'New',
    createdAt: new Date().toISOString(),
  });

  res.status(201).json({
    success: true,
    message: 'Thank you for reaching out to Imaan Relief & Development Foundation. Your inquiry has been dispatched to our secretariat team.',
    data: contact,
  });
};

export const getContacts = async (req: AuthRequest, res: Response) => {
  const { status, search, page = 1, limit = 20 } = req.query;

  const filter: any = {};
  if (status && status !== 'all') {
    filter.status = status;
  }

  if (search) {
    filter.$or = [
      { name: new RegExp(String(search), 'i') },
      { email: new RegExp(String(search), 'i') },
      { subject: new RegExp(String(search), 'i') },
      { message: new RegExp(String(search), 'i') },
    ];
  }

  const p = Math.max(1, parseInt(String(page)));
  const l = Math.min(100, Math.max(1, parseInt(String(limit))));
  const skip = (p - 1) * l;

  const totalItems = await dbStorage.count('contact', filter);
  const data = await dbStorage.find('contact', filter, {
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

export const getContactById = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  const contact = await dbStorage.findById('contact', id);
  if (!contact) {
    return res.status(404).json({ success: false, message: 'Message not found' });
  }

  // Auto mark as Read if New
  if (contact.status === 'New') {
    await dbStorage.findByIdAndUpdate('contact', id, { status: 'Read' });
    contact.status = 'Read';
  }

  res.status(200).json({
    success: true,
    data: contact,
  });
};

export const updateContact = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { status, replyNotes } = req.body;

  const existing = await dbStorage.findById('contact', id);
  if (!existing) {
    return res.status(404).json({ success: false, message: 'Message not found' });
  }

  const updateData: any = {};
  if (status) updateData.status = status;
  if (replyNotes !== undefined) {
    updateData.replyNotes = replyNotes;
    updateData.repliedAt = new Date().toISOString();
    updateData.repliedBy = req.user?.name;
    if (status !== 'Archived') {
      updateData.status = 'Replied';
    }
  }

  const updated = await dbStorage.findByIdAndUpdate('contact', id, updateData);

  if (req.user) {
    await logActivity(req.user, 'Message Updated', 'ContactMessage', id, `Status updated to ${updateData.status || existing.status}`);
  }

  res.status(200).json({
    success: true,
    data: updated,
  });
};

export const deleteContact = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  const existing = await dbStorage.findById('contact', id);
  if (!existing) {
    return res.status(404).json({ success: false, message: 'Message not found' });
  }

  await dbStorage.findByIdAndDelete('contact', id);

  if (req.user) {
    await logActivity(req.user, 'Message Deleted', 'ContactMessage', id, existing.subject);
  }

  res.status(200).json({
    success: true,
    message: 'Message deleted successfully',
  });
};
