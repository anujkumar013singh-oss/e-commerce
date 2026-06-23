import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';

dotenv.config();

// Cached connection for serverless environments
let dbPromise;
async function connectDB() {
  if (dbPromise) return dbPromise;
  dbPromise = mongoose.connect(process.env.MONGO_URI).then(() => {
    console.log('✓ MongoDB connected');
  }).catch(err => {
    console.error('✗ MongoDB connection error:', err.message);
  });
  return dbPromise;
}
connectDB();
export { connectDB };

import authRoutes from './routes/auth.js';
import productRoutes from './routes/products.js';
import orderRoutes from './routes/orders.js';
import cartRoutes from './routes/cart.js';
import adminRoutes from './routes/admin.js';
import stripeRoutes from './routes/stripe.js';
import contactRoutes from './routes/contact.js';

const app = express();

app.use(helmet({ crossOriginResourcePolicy: false }));
const normalizeOrigin = (origin) => origin?.replace(/\/$/, '');
const allowedOrigins = [process.env.CLIENT_URL].filter(Boolean).map(normalizeOrigin);
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.some(a => origin === a) || origin.endsWith('.vercel.app')) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
app.use(morgan('dev'));
app.use(cookieParser());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/stripe', stripeRoutes);
app.use('/api/contact', contactRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', dbState: mongoose.connection.readyState, timestamp: new Date().toISOString() });
});

app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(err.status || 500).json({ message: err.message || 'Internal server error' });
});

export default app;
