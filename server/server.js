import mongoose from 'mongoose';
import app from './app.js';

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✓ MongoDB connected');
    app.listen(PORT, () => console.log(`✓ Server running on http://localhost:${PORT}`));
  })
  .catch(err => {
    console.error('✗ MongoDB connection error:', err.message);
    console.log('  Starting server without database...');
    app.listen(PORT, () => console.log(`✓ Server running on http://localhost:${PORT} (no DB)`));
  });
