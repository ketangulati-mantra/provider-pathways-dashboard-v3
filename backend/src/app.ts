import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import healthRoutes from './routes/health.js';
import userRoutes from './routes/userRoutes.js';
import activityRoutes from './routes/activityRoutes.js';
import submissionRoutes from './routes/submissionRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import certificateRoutes from './routes/certificateRoutes.js';
import campusRoutes from './campus-program/routes/campusRoutes.js';
import corporateRoutes from './corporate-program/routes/corporateRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors());
app.use(express.json());

// API Routes & Health Checks (mounted for root and subpath proxies)
const apiPrefixes = [
  '/api',
  '/provider_pathways_dashboard_v3/api',
  '/provider_pathways_dashboard_v2/api',
  '/provider_pathways_dashboard_v1/api',
  '/provider_dashboard_v1/api',
  '/provider_pathways_v2_testing/api',
  '/provider_pathways/api'
];

apiPrefixes.forEach((prefix) => {
  app.use(prefix, healthRoutes);
  app.use(prefix, submissionRoutes);
  app.use(prefix, uploadRoutes);
  app.use(prefix, certificateRoutes);
  app.use(`${prefix}/users`, userRoutes);
  app.use(`${prefix}/activities`, activityRoutes);
  app.use(`${prefix}/campus-program`, campusRoutes);
  app.use(`${prefix}/corporate-program`, corporateRoutes);
});

// Serve Frontend Static Assets in Production (supporting root and subpaths)
const distPath = path.join(__dirname, '../../dist');
app.use(express.static(distPath));

const subpaths = [
  '/provider_pathways_dashboard_v3',
  '/provider_pathways_dashboard_v2',
  '/provider_dashboard_v1',
  '/provider_pathways_dashboard_v1',
  '/provider_pathways_v2_testing',
  '/provider_pathways'
];

subpaths.forEach((subpath) => {
  app.use(subpath, express.static(distPath));
});

app.get('*', (req, res, next) => {
  if (req.path.includes('/api/')) return next();
  res.sendFile(path.join(distPath, 'index.html'), (err) => {
    if (err) next();
  });
});

// Error Middleware
app.use(errorHandler);

export default app;
