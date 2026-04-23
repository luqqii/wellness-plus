import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import fileUpload from 'express-fileupload';
import env from './config/env.js';
import { errorHandler } from './middleware/error.middleware.js';

// Import Routes
import authRoutes from './routes/auth.routes.js';
import coachRoutes from './routes/coach.routes.js';
import userRoutes from './routes/user.routes.js';
import metricsRoutes from './routes/metrics.routes.js';
import habitRoutes from './routes/habits.routes.js';
import notificationRoutes from './routes/notification.routes.js';
import nutritionRoutes from './routes/nutrition.routes.js';
import insightsRoutes from './routes/insights.routes.js';
import activityRoutes from './routes/activity.routes.js';
import integrationRoutes from './routes/integration.routes.js';

const app = express();

// ==========================================
// Middleware Stack
// ==========================================

// Security headers
app.use(helmet());

// Apply global rate limiter
import { globalLimiter } from './middleware/rateLimit.middleware.js';
app.use('/api', globalLimiter);

// CORS configuration (allow frontend origin)
app.use(cors({
  origin: [env.CLIENT_URL, 'https://wellness-plus-client.vercel.app'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS']
}));

// Body parsing
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(fileUpload({
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB limit
}));

// Cookie parsing
app.use(cookieParser());

// HTTP request logger
if (env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// ==========================================
// API Routes
// ==========================================

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/coach', coachRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/metrics', metricsRoutes);
app.use('/api/v1/habits', habitRoutes);
app.use('/api/v1/notifications', notificationRoutes);
app.use('/api/v1/nutrition', nutritionRoutes);
app.use('/api/v1/insights', insightsRoutes);
app.use('/api/v1/activity', activityRoutes);
app.use('/api/v1/integrations', integrationRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Wellness+ API is running', timestamp: new Date() });
});

// ==========================================
// Global Error Handling
// ==========================================

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({ success: false, message: 'API endpoint not found' });
});

// Global error handling middleware (Sentry wrapper)
app.use(errorHandler);

export default app;
