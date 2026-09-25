import dotenv from 'dotenv';
dotenv.config();

import { connectDB } from '../config/db.ts';
import { dbStorage } from '../services/dbStorage.ts';

async function runSeed() {
  console.log('[Seed] Initializing seed script for Imaan Relief & Development Foundation...');
  await connectDB();
  await dbStorage.init();
  console.log('[Seed] Database initialization and seed completed successfully.');
  process.exit(0);
}

runSeed().catch((err) => {
  console.error('[Seed Error]:', err);
  process.exit(1);
});
