import { Request, Response } from 'express';
import { dbStorage } from '../services/dbStorage.ts';
import { AuthRequest } from '../middleware/authMiddleware.ts';
import { logActivity } from '../services/activityService.ts';

export const createDonation = async (req: Request, res: Response) => {
  const { donorName, email, phone, amount, currency = 'USD', frequency = 'One-time', purpose = 'Where Needed Most', paymentMethod = 'Card (Stripe / Bank Intent)', coverFees = true, dedication, billingCountry = 'United States' } = req.body;

  if (!donorName || !email || !amount || Number(amount) <= 0) {
    return res.status(400).json({
      success: false,
      message: 'Please provide donor name, valid email, and positive donation amount',
    });
  }

  const numAmount = parseFloat(String(amount));
  const fee = coverFees ? parseFloat((numAmount * 0.025).toFixed(2)) : 0;
  const totalCharged = parseFloat((numAmount + fee).toFixed(2));
  const transactionReference = `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;

  const donation = await dbStorage.create('donations', {
    donorName,
    email: email.toLowerCase().trim(),
    phone: phone || '',
    amount: numAmount,
    currency: currency.toUpperCase(),
    frequency,
    purpose,
    paymentMethod,
    paymentStatus: 'completed', // Recorded donation intent/completion
    transactionReference,
    coverFees: Boolean(coverFees),
    feeAmount: fee,
    totalCharged,
    dedication: dedication || {},
    billingCountry,
    createdAt: new Date().toISOString(),
  });

  res.status(201).json({
    success: true,
    message: 'Your generous contribution has been securely registered. A formal tax receipt and acknowledgement has been prepared.',
    data: donation,
  });
};

export const getDonations = async (req: AuthRequest, res: Response) => {
  const { search, status, purpose, page = 1, limit = 20 } = req.query;

  const filter: any = {};
  if (status && status !== 'all') {
    filter.paymentStatus = status;
  }
  if (purpose && purpose !== 'all') {
    filter.purpose = new RegExp(String(purpose), 'i');
  }

  if (search) {
    filter.$or = [
      { donorName: new RegExp(String(search), 'i') },
      { email: new RegExp(String(search), 'i') },
      { transactionReference: new RegExp(String(search), 'i') },
    ];
  }

  const p = Math.max(1, parseInt(String(page)));
  const l = Math.min(100, Math.max(1, parseInt(String(limit))));
  const skip = (p - 1) * l;

  const totalItems = await dbStorage.count('donations', filter);
  const data = await dbStorage.find('donations', filter, {
    sort: { createdAt: -1 },
    skip,
    limit: l,
  });

  // Calculate quick aggregates
  const allDonations = await dbStorage.find('donations', {});
  const totalAmountRaised = allDonations.reduce((acc: number, cur: any) => acc + (Number(cur.amount) || 0), 0);

  res.status(200).json({
    success: true,
    data,
    aggregates: {
      totalAmountRaised,
      totalCount: allDonations.length,
    },
    currentPage: p,
    totalPages: Math.ceil(totalItems / l) || 1,
    totalItems,
  });
};

export const getDonationById = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  const donation = await dbStorage.findById('donations', id);
  if (!donation) {
    return res.status(404).json({ success: false, message: 'Donation record not found' });
  }

  res.status(200).json({
    success: true,
    data: donation,
  });
};

export const updateDonation = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { paymentStatus, notes } = req.body;

  const existing = await dbStorage.findById('donations', id);
  if (!existing) {
    return res.status(404).json({ success: false, message: 'Donation record not found' });
  }

  const updated = await dbStorage.findByIdAndUpdate('donations', id, {
    ...(paymentStatus && { paymentStatus }),
    ...(notes !== undefined && { notes }),
  });

  if (req.user) {
    await logActivity(req.user, 'Donation Updated', 'Donation', id, `Status updated to ${paymentStatus || existing.paymentStatus}`);
  }

  res.status(200).json({
    success: true,
    data: updated,
  });
};

export const deleteDonation = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  const existing = await dbStorage.findById('donations', id);
  if (!existing) {
    return res.status(404).json({ success: false, message: 'Donation record not found' });
  }

  await dbStorage.findByIdAndDelete('donations', id);

  if (req.user) {
    await logActivity(req.user, 'Donation Record Deleted', 'Donation', id, existing.transactionReference);
  }

  res.status(200).json({
    success: true,
    message: 'Donation record deleted',
  });
};
