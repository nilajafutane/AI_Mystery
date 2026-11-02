import dotenv from 'dotenv';
dotenv.config();
const clientOrigins = (process.env.CLIENT_URLS || process.env.CLIENT_URL || 'http://localhost:5173')
  .split(',')
  .map((origin) => origin.trim().replace(/\/$/, ''))
  .filter(Boolean);
export const env = {
  port: Number(process.env.PORT || 5000),
  host: process.env.HOST || '0.0.0.0',
  clientOrigins,
  mongoUri: process.env.MONGODB_URI,
  geminiKey: process.env.GEMINI_API_KEY,
  geminiModel: process.env.GEMINI_TEXT_MODEL || 'gemini-3.8-flash',
  demoMode: process.env.DEMO_MODE === 'true',
  isProduction: process.env.NODE_ENV === 'production',
};
