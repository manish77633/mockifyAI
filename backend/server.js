require('dotenv').config();
const express   = require('express');
const mongoose  = require('mongoose');
const cors      = require('cors');
const helmet    = require('helmet');
const morgan    = require('morgan');
const rateLimit = require('express-rate-limit');

const app = express();

// ─── Security & Logging ───────────────────────────────────────────────────────
app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_ORIGIN || '*', credentials: true }));
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.set('trust proxy', 1);

// ─── Rate Limiters ────────────────────────────────────────────────────────────
// const generalLimiter = rateLimit({
//   windowMs: 15 * 60 * 1000, max: 100,
//   standardHeaders: true, legacyHeaders: false,
//   message: { success: false, message: 'Too many requests. Please try again later.' },
// });

// 60 req/min/IP — public dynamic mock-serve route
const mockFetchLimiter = rateLimit({
  windowMs: 60 * 1000, max: 60,
  standardHeaders: true, legacyHeaders: false,
  keyGenerator: (req) => req.ip,
  message: { success: false, message: 'Rate limit exceeded. Max 60 requests/min per IP.' },
});

// 10 req/min — Gemini AI generation
// const aiGeneratorLimiter = rateLimit({
//   windowMs: 60 * 1000, max: 10,
//   standardHeaders: true, legacyHeaders: false,
//   message: { success: false, message: 'AI generation rate limit: max 10 requests/min.' },
// });

// app.use('/api', generalLimiter);
// app.use('/api/endpoints/generate', aiGeneratorLimiter); // Must precede router mount

// ─── Body Parsers ─────────────────────────────────────────────────────────────
app.use(express.json({ limit: '11mb' }));
app.use(express.urlencoded({ extended: true, limit: '32kb' }));

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use('/api/auth',      require('./routes/auth'));
app.use('/api/users',     require('./routes/users'));
app.use('/api/payment',   require('./routes/paymentRoutes'));
app.use('/api/endpoints', require('./routes/apiRoutes'));          // management CRUD
app.use('/api',           mockFetchLimiter, require('./routes/apiRoutes')); // public wildcard

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get('/health', (_req, res) =>
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
);

// ─── 404 ──────────────────────────────────────────────────────────────────────
app.use((_req, res) =>
  res.status(404).json({ success: false, message: 'Route not found.' })
);

// ─── Global Error Handler ─────────────────────────────────────────────────────
// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  console.error('[GlobalError]', err);
  const status  = err.status || err.statusCode || 500;
  const message =
    process.env.NODE_ENV === 'production' && status === 500
      ? 'Internal server error.'
      : err.message || 'Internal server error.';
  res.status(status).json({ success: false, message });
});

// ─── Boot ─────────────────────────────────────────────────────────────────────
const PORT      = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) { console.error('FATAL: MONGO_URI not set.'); process.exit(1); }

mongoose
  .connect(MONGO_URI, { serverSelectionTimeoutMS: 5000, socketTimeoutMS: 45000 })
  .then(() => {
    console.log('✅  MongoDB connected');
    app.listen(PORT, () => console.log(`🚀  MockifyAI listening on :${PORT}`));
  })
  .catch((err) => { console.error('FATAL:', err.message); process.exit(1); });

process.on('SIGTERM', async () => { await mongoose.connection.close(); process.exit(0); });

module.exports = app;
