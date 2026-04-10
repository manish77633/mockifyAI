require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const path = require('path');

const app = express();

// ─── Health Check (Top level, skips logging) ──────────────────────────────────
app.get('/health', (_req, res) =>
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
);

// ─── Security & Logging ───────────────────────────────────────────────────────
app.use(helmet());
app.use(cors({
  origin: (origin, callback) => {
    const allowed = [process.env.CLIENT_ORIGIN, 'http://localhost:3000'].filter(Boolean);
    if (!origin || allowed.includes(origin) || process.env.NODE_ENV !== 'production') {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev', {
  skip: (req) => req.url === '/health'
}));
app.set('trust proxy', 1);

// ─── Body Parsers ─────────────────────────────────────────────────────────────
app.use(express.json({ limit: '11mb' }));
app.use(express.urlencoded({ extended: true, limit: '32kb' }));

// ─── Rate Limiters ────────────────────────────────────────────────────────────
const mockFetchLimiter = rateLimit({
  windowMs: 60 * 1000, 
  max: 60,
  standardHeaders: true, 
  legacyHeaders: false,
  keyGenerator: (req) => req.ip,
  message: { success: false, message: 'Rate limit exceeded. Max 60 requests/min per IP.' },
});

// ─── API Routes ───────────────────────────────────────────────────────────────
// Explicitly mount auth, users, and endpoints first
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/payment', require('./routes/paymentRoutes'));
app.use('/api/endpoints', require('./routes/apiRoutes'));
app.use('/api/mock', mockFetchLimiter, require('./routes/mockRoutes'));

// ─── Serve Frontend in Production ─────────────────────────────────────────────
if (process.env.NODE_ENV === 'production') {
  // Serve static files from the frontend/dist folder
  app.use(express.static(path.join(__dirname, '../frontend/dist')));
  
  // Smart Catch-all Route
  app.get('*', (req, res, next) => {
    // If request is for an API route that wasn't matched above, 
    // pass it to the 404 JSON handler
    if (req.originalUrl.startsWith('/api')) {
      return next();
    }
    // Otherwise, send the frontend's index.html
    res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
  });
}

// ─── 404 API Error Handler ────────────────────────────────────────────────────
// Any request reaching here will receive a JSON 404 response
app.use((_req, res) =>
  res.status(404).json({ success: false, message: 'Route not found.' })
);

// ─── Global Error Handler ─────────────────────────────────────────────────────
app.use((err, _req, res, _next) => {
  console.error('[GlobalError]', err);
  const status = err.status || err.statusCode || 500;
  const message =
    process.env.NODE_ENV === 'production' && status === 500
      ? 'Internal server error.'
      : err.message || 'Internal server error.';
  res.status(status).json({ success: false, message });
});

// ─── Boot ─────────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) { 
  console.error('FATAL: MONGO_URI not set.'); 
  process.exit(1); 
}

// Connect to MongoDB first, then start the server
mongoose
  .connect(MONGO_URI, { serverSelectionTimeoutMS: 5000, socketTimeoutMS: 45000 })
  .then(() => {
    console.log('✅  MongoDB connected');
    app.listen(PORT, () => console.log(`🚀  MockifyAI listening on :${PORT}`));
  })
  .catch((err) => { 
    console.error('FATAL:', err.message); 
    process.exit(1); 
  });

process.on('SIGTERM', async () => { 
  await mongoose.connection.close(); 
  process.exit(0); 
});

module.exports = app;