import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import 'express-async-errors';
import dotenv from 'dotenv';
import { errorHandler } from './shared/middleware/error-handler';
import { notFoundHandler } from './shared/middleware/not-found-handler';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes
import { subscriptionRoutes } from './features/subscriptions/get-plan-limits';
import { billingRoutes } from './features/billing/generate-monthly-billing';
import { paymentRoutes } from './features/payments/report-payment-ai';

app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/billing', billingRoutes);
app.use('/api/payments', paymentRoutes);

// Error handling middleware (must be last)
app.use(notFoundHandler);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
