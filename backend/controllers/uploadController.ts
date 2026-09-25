import { Request, Response } from 'express';
import { uploadToCloudinary } from '../services/cloudinaryService.ts';

export const uploadFile = async (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: 'No file uploaded',
    });
  }

  try {
    const result = await uploadToCloudinary(req.file.path);

    res.status(200).json({
      success: true,
      url: result.url,
      filename: req.file.filename,
      originalName: req.file.originalname,
      isCloudinary: result.isCloudinary,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'File upload failed',
    });
  }
};
