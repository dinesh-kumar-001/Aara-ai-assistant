import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Search multiple possible locations for .env
const candidatePaths = [
  path.resolve(__dirname, '../../.env'),           // backend/.env
  path.resolve(__dirname, '../../../server/.env'), // server/.env
  path.resolve(__dirname, '../../../.env')         // root .env
];

let loadedPath = null;
for (const envPath of candidatePaths) {
  if (fs.existsSync(envPath)) {
    dotenv.config({ path: envPath });
    loadedPath = envPath;
    break;
  }
}

// Fallback to default dotenv if none found
if (!loadedPath) {
  dotenv.config();
}

// Detect API key from various common names without exposing it
const resolvedApiKey =
  process.env.AI_API_KEY ||
  process.env.GEMINI_API_KEY ||
  process.env.GOOGLE_API_KEY ||
  process.env.GROQ_API_KEY ||
  process.env.OPENAI_API_KEY ||
  '';

export const config = {
  port: parseInt(process.env.PORT, 10) || 5000,
  clientOrigin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
  mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/aara_assistant',
  aiProvider: (process.env.AI_PROVIDER || (resolvedApiKey ? 'gemini' : 'demo')).toLowerCase().trim(),
  aiApiKey: resolvedApiKey.trim(),
  aiBaseUrl: process.env.AI_BASE_URL || '',
  aiModel: process.env.AI_MODEL || '',
  isProduction: process.env.NODE_ENV === 'production',
  envFilePath: loadedPath
};

export default config;
