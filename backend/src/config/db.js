import mongoose from 'mongoose';
import config from './env.js';

let isConnected = false;

export const connectDB = async () => {
  // If no Mongo URI provided or explicit zero-cost mode
  if (!config.mongoUri) {
    console.log('ℹ️  MongoDB URI not configured. Running in Zero-Cost Local Persistence Mode.');
    isConnected = false;
    return false;
  }

  try {
    console.log('🔄 Attempting MongoDB connection...');
    const conn = await mongoose.connect(config.mongoUri, {
      serverSelectionTimeoutMS: 3000 // Fast fail so startup isn't blocked
    });
    isConnected = true;
    console.log(`✅ MongoDB Connected successfully: ${conn.connection.host}`);
    return true;
  } catch (err) {
    isConnected = false;
    console.warn(`⚠️  MongoDB connection failed (${err.message}).`);
    console.log('🚀 Aara is activating Zero-Cost Local File Persistence Mode. Full functionality remains active!');
    return false;
  }
};

export const isMongoConnected = () => isConnected;

export const getDbStatus = () => ({
  connected: isConnected,
  type: isConnected ? 'MongoDB' : 'Local File Persistence (Zero-Cost)',
  host: isConnected ? mongoose.connection?.host : 'Local JSON Store'
});
