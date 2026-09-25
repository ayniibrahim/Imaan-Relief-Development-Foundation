export const getCloudinaryConfig = () => {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  const isConfigured = Boolean(cloudName && apiKey && apiSecret && !cloudName.includes('MY_'));

  return {
    cloudName: cloudName || '',
    apiKey: apiKey || '',
    apiSecret: apiSecret || '',
    isConfigured,
  };
};
