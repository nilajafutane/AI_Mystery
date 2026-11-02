import mongoose from 'mongoose';
import app from './app.js';
import { env } from './config/env.js';
if (env.mongoUri) {
  try { await mongoose.connect(env.mongoUri, { serverSelectionTimeoutMS: 5000 }); globalThis.mongoReady = true; console.log('[db] MongoDB connected'); }
  catch (error) { console.error('[db] MongoDB unavailable; starting in memory demo mode:', error.message); globalThis.mongoReady = false; }
} else { globalThis.mongoReady = false; }
app.listen(env.port, () => console.log(`[api] Listening on http://localhost:${env.port}`));
