import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { ZodError } from 'zod';
import { env } from './config/env.js';
import caseRoutes from './routes/caseRoutes.js';
const app = express();
app.use(helmet());
app.set('trust proxy', env.isProduction ? 1 : false);
app.use(cors({
  origin(origin, callback) {
    const normalizedOrigin = origin?.replace(/\/$/, '');
    if (!normalizedOrigin || env.clientOrigins.includes(normalizedOrigin)) return callback(null, true);
    return callback(new Error('Origin not allowed by CORS'));
  },
}));
app.use(express.json({ limit: '100kb' }));
app.get('/api/v1/health', (_req, res) => {
  const database = globalThis.mongoReady ? 'connected' : env.isProduction ? 'unavailable' : 'memory-demo';
  const ready = !env.isProduction || globalThis.mongoReady === true;
  res.status(ready ? 200 : 503).json({ success: ready, service: 'after-hours-api', database });
});
app.use('/api/v1/cases', caseRoutes);
app.use((req, res) => res.status(404).json({ success: false, message: 'The requested route was not found.' }));
app.use((error, _req, res, _next) => {
  if (error instanceof ZodError) return res.status(400).json({ success: false, message: 'Please check the information and try again.', issues: error.issues.map(({ path, message }) => ({ field: path.join('.'), message })) });
  if (error?.name === 'MongoServerError' && error.code === 11000) return res.status(409).json({ success: false, message: 'This action has already been recorded.' });
  const status = error.status || 500;
  if (status >= 500) console.error('[api]', error.message);
  res.status(status).json({ success: false, message: status >= 500 ? (error.message.includes('configured') || error.message.includes('validation') ? error.message : 'The request could not be completed. Please try again.') : error.message });
});
export default app;
