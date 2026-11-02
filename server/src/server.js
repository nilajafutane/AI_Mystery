import mongoose from 'mongoose';
import app from './app.js';
import { env } from './config/env.js';
if (env.isProduction && !env.mongoUri) throw new Error('[config] MONGODB_URI is required in production.');
if (env.isProduction && !env.demoMode && !env.geminiKey) throw new Error('[config] GEMINI_API_KEY is required when DEMO_MODE is false.');
if (env.mongoUri) {
  try { await mongoose.connect(env.mongoUri, { serverSelectionTimeoutMS: 5000 }); globalThis.mongoReady = true; console.log('[db] MongoDB connected'); }
  catch (error) {
    globalThis.mongoReady = false;
    if (env.isProduction) throw new Error(`[db] MongoDB connection failed: ${error.message}`);
    console.error('[db] MongoDB unavailable; starting in memory demo mode:', error.message);
  }
} else { globalThis.mongoReady = false; }
mongoose.connection.on('connected', () => { globalThis.mongoReady = true; });
mongoose.connection.on('disconnected', () => { globalThis.mongoReady = false; });
app.listen(env.port, env.host, () => console.log(`[api] Listening on ${env.host}:${env.port}`));
