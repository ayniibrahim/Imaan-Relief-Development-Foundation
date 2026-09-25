import { dbStorage } from './dbStorage.ts';

export const logActivity = async (
  user: { id: string; name: string; email: string; role: string },
  action: string,
  resourceType: string,
  resourceId?: string,
  details?: string,
  ipAddress?: string
) => {
  try {
    await dbStorage.create('logs', {
      user,
      action,
      resourceType,
      resourceId,
      details,
      ipAddress,
      createdAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Failed to log admin activity:', error);
  }
};
