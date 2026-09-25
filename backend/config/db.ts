import mongoose from 'mongoose';

let isConnected = false;

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  if (!uri || uri.includes('<username>') || uri.includes('YOUR_')) {
    console.log('[Database] MONGODB_URI not configured. Operating in high-performance embedded storage mode.');
    isConnected = false;
    return false;
  }

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`[Database] MongoDB Connected: ${conn.connection.host}`);
    isConnected = true;
    return true;
  } catch (error: any) {
    console.warn(`[Database] MongoDB connection failed: ${error.message}. Falling back to embedded file storage mode.`);
    isConnected = false;
    return false;
  }
};

export const getDBStatus = () => {
  return {
    connected: isConnected,
    mode: isConnected ? 'MongoDB / Mongoose' : 'Embedded Persistent Storage (Production/Local Fallback)',
    host: isConnected ? mongoose.connection.host : 'Local Persistent Data Store',
  };
};
