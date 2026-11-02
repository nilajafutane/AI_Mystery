import dotenv from 'dotenv';
dotenv.config();
export const env = {
  port: Number(process.env.PORT || 5000),
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  mongoUri: process.env.MONGODB_URI,
  geminiKey: process.env.GEMINI_API_KEY,
  geminiModel: process.env.GEMINI_TEXT_MODEL || 'gemini-3.8-flash',
  demoMode: process.env.DEMO_MODE === 'true',
};
