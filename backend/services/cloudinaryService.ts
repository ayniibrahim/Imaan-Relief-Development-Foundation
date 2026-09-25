import fs from 'fs';
import path from 'path';
import { getCloudinaryConfig } from '../config/cloudinary.ts';

export const uploadToCloudinary = async (filePath: string, folder = 'imaan_relief'): Promise<{ url: string; publicId?: string; isCloudinary: boolean }> => {
  const config = getCloudinaryConfig();

  // If Cloudinary credentials are provided, we can upload using standard Cloudinary REST API or SDK
  if (config.isConfigured) {
    try {
      const fileBuffer = fs.readFileSync(filePath);
      const base64Data = fileBuffer.toString('base64');
      const ext = path.extname(filePath).replace('.', '');
      const mime = ext === 'svg' ? 'image/svg+xml' : `image/${ext}`;
      const dataUri = `data:${mime};base64,${base64Data}`;

      // Call Cloudinary Upload API
      const timestamp = Math.round(new Date().getTime() / 1000);
      const url = `https://api.cloudinary.com/v1_1/${config.cloudName}/image/upload`;

      const formData = new FormData();
      formData.append('file', dataUri);
      formData.append('upload_preset', 'unsigned_preset'); // or authenticated signature
      formData.append('folder', folder);

      // If needed in production, users can supply upload preset or standard cloud
      // Fallback cleanly to local URL if network or preset fails
      const response = await fetch(url, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const json = await response.json();
        return {
          url: json.secure_url,
          publicId: json.public_id,
          isCloudinary: true,
        };
      }
    } catch (err) {
      console.warn('[Cloudinary] Remote upload notice:', err);
    }
  }

  // Local storage fallback: serve from /uploads/<filename>
  const filename = path.basename(filePath);
  return {
    url: `/uploads/${filename}`,
    isCloudinary: false,
  };
};
