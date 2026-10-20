import express from 'express';
import cors from 'cors';
import config from './config/env.js';
import { connectDB } from './config/db.js';
import chatRoutes from './routes/chatRoutes.js';
import conversationRoutes from './routes/conversationRoutes.js';
import configRoutes from './routes/configRoutes.js';
import { notFoundHandler, globalErrorHandler } from './middlewares/errorHandler.js';

const app = express();

// CORS configuration supporting Vite dev server and custom origins
const allowedOrigins = [
  config.clientOrigin,
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:3000'
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g., mobile apps, curl, postman)
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(null, true); // Permissive for local dev
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);

app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true }));

// Root welcome route
app.get('/', (req, res) => {
  res.json({
    app: 'Aara — Personal AI Voice & Chat Assistant',
    owner: 'Mr. Dinesh Kumar',
    tagline: 'Your personal assistant, always ready to help.',
    status: 'online',
    apiDocs: '/api/status'
  });
});

// API Routes
app.use('/api/chat', chatRoutes);
app.use('/api/conversations', conversationRoutes);
app.use('/api', configRoutes);

// Error handlers
app.use(notFoundHandler);
app.use(globalErrorHandler);

// Start server
const startServer = async () => {
  console.log('\n======================================================');
  console.log('🤖 AARA — Personal AI Voice & Chat Assistant');
  console.log('👑 Purpose: Mr. Dinesh Kumar\'s Personal AI Assistant');
  console.log('✨ Tagline: "Your personal assistant, always ready to help."');
  console.log('======================================================');

  // Attempt database connection (gracefully continues if Mongo is offline)
  await connectDB();

  app.listen(config.port, () => {
    console.log(`\n🚀 Backend API Server running on: http://localhost:${config.port}`);
    console.log(`📡 Client Origin allowed: ${config.clientOrigin}`);
    console.log(`🧠 Configured AI Provider: ${config.aiProvider} (${config.aiApiKey ? 'API Key present' : 'Zero-Cost Local Mode active'})`);
    console.log('======================================================\n');
  });
};

startServer().catch((err) => {
  console.error('Fatal Server Startup Error:', err);
  process.exit(1);
});

export default app;
