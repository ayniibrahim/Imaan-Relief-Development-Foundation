import express from 'express';
import path from 'path';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

import { connectDB, getDBStatus } from './backend/config/db.ts';
import { dbStorage } from './backend/services/dbStorage.ts';

import authRoutes from './backend/routes/authRoutes.ts';
import programRoutes from './backend/routes/programRoutes.ts';
import projectRoutes from './backend/routes/projectRoutes.ts';
import newsRoutes from './backend/routes/newsRoutes.ts';
import storyRoutes from './backend/routes/storyRoutes.ts';
import eventRoutes from './backend/routes/eventRoutes.ts';
import galleryRoutes from './backend/routes/galleryRoutes.ts';
import teamRoutes from './backend/routes/teamRoutes.ts';
import volunteerRoutes from './backend/routes/volunteerRoutes.ts';
import donationRoutes from './backend/routes/donationRoutes.ts';
import contactRoutes from './backend/routes/contactRoutes.ts';
import userRoutes from './backend/routes/userRoutes.ts';
import settingsRoutes from './backend/routes/settingsRoutes.ts';
import uploadRoutes from './backend/routes/uploadRoutes.ts';
import { notFound, errorHandler } from './backend/middleware/errorMiddleware.ts';

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;
  const isDev = process.env.NODE_ENV !== 'production';

  // Initialize DB and storage
  await connectDB();
  await dbStorage.init();

  // Security & Middleware
  const clientUrl = process.env.CLIENT_URL || '*';
  app.use(
    cors({
      origin: clientUrl === '*' ? true : [clientUrl, 'http://localhost:3000', 'http://localhost:5173'],
      credentials: true,
    })
  );

  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Static uploads directory
  const uploadsDir = path.resolve(process.cwd(), 'uploads');
  app.use('/uploads', express.static(uploadsDir));

  // Health and System Status Endpoint
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'healthy',
      organization: 'Imaan Relief & Development Foundation',
      timestamp: new Date().toISOString(),
      database: getDBStatus(),
    });
  });

  // REST API Routes
  app.use('/api/auth', authRoutes);
  app.use('/api/programs', programRoutes);
  app.use('/api/projects', projectRoutes);
  app.use('/api/news', newsRoutes);
  app.use('/api/stories', storyRoutes);
  app.use('/api/events', eventRoutes);
  app.use('/api/gallery', galleryRoutes);
  app.use('/api/team', teamRoutes);
  app.use('/api/volunteers', volunteerRoutes);
  app.use('/api/donations', donationRoutes);
  app.use('/api/contact', contactRoutes);
  app.use('/api/users', userRoutes);
  app.use('/api/settings', settingsRoutes);
  app.use('/api/upload', uploadRoutes);

  // Development: Mount Vite Middlewares
  if (isDev) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Production: Serve dist files
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  // Error handling middleware for API
  app.use('/api/*', notFound);
  app.use(errorHandler);

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`[Server] Imaan Relief & Development platform active on port ${PORT}`);
    console.log(`[Server] Environment: ${process.env.NODE_ENV || 'development'}`);
  });
}

startServer().catch((err) => {
  console.error('[Server Fatal]:', err);
});
