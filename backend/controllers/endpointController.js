const mongoose = require('mongoose');
const MockEndpoint = require('../models/MockEndpoint');
const User         = require('../models/User');
const { generateMockData } = require('../utils/gemini');

// ─── Payload Size Constants ───────────────────────────────────────────────────
const FREE_LIMIT_BYTES = 1   * 1024 * 1024; //  1 MB
const PRO_LIMIT_BYTES  = 10  * 1024 * 1024; // 10 MB

/**
 * Returns the byte size of a value after JSON serialisation.
 * @param {*} value
 * @returns {number}
 */
function jsonByteSize(value) {
  return Buffer.byteLength(JSON.stringify(value), 'utf8');
}

/**
 * Enforces the per-user payload ceiling.
 * Returns an error object { status, message } or null if within limits.
 */
function checkPayloadSize(payload, isPro) {
  const bytes     = jsonByteSize(payload);
  const limitBytes = isPro ? PRO_LIMIT_BYTES : FREE_LIMIT_BYTES;
  const limitLabel = isPro ? '10 MB' : '1 MB';

  if (bytes > limitBytes) {
    return {
      status: 413,
      message: isPro
        ? `Payload size (${(bytes / 1024 / 1024).toFixed(2)} MB) exceeds the Pro limit of ${limitLabel}.`
        : `Payload size (${(bytes / 1024 / 1024).toFixed(2)} MB) exceeds the free-tier limit of ${limitLabel}. Upgrade to Pro for up to 10 MB.`,
    };
  }
  return null;
}

/**
 * Builds the public live URL for a mock endpoint.
 */
function buildLiveUrl(req, username, endpoint) {
  const base = process.env.API_BASE_URL || `${req.protocol}://${req.get('host')}`;
  return `${base}/api/${username}/${endpoint}`;
}

// ─── Controller: createEndpointModeA (AI Generator) ──────────────────────────
/**
 * POST /api/endpoints/generate
 * Body: { prompt: string, endpointName: string }
 * Auth: required
 */
exports.createEndpointModeA = async (req, res, next) => {
  try {
    const { prompt, endpointName } = req.body;

    if (!prompt?.trim())       return res.status(400).json({ success: false, message: '`prompt` is required.' });
    if (!endpointName?.trim()) return res.status(400).json({ success: false, message: '`endpointName` is required.' });

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });

    // Quota check
    if (false && user.endpointCount >= (user.isPro ? 100 : 10)) {
      return res.status(403).json({
        success: false,
        message: `Endpoint limit reached (${user.isPro ? 100 : 10}). ${user.isPro ? '' : 'Upgrade to Pro for more.'}`.trim(),
      });
    }

    // Call Gemini (timeout handled inside the service)
    let payload;
    try {
      payload = await generateMockData(prompt.trim());
    } catch (geminiErr) {
      return res.status(geminiErr.statusCode || 502).json({
        success: false,
        message: geminiErr.message,
      });
    }

    // Payload size guard
    const sizeError = checkPayloadSize(payload, user.isPro);
    if (sizeError) return res.status(sizeError.status).json({ success: false, message: sizeError.message });

    const slug = endpointName.trim().toLowerCase().replace(/\s+/g, '-');

    const mock = await MockEndpoint.create({
      owner:            user._id,
      username:         user.username,
      endpoint:         slug,
      payload,
      payloadSizeBytes: jsonByteSize(payload),
      mode:             'ai',
      prompt:           prompt.trim(),
    });

    await User.findByIdAndUpdate(user._id, { $inc: { endpointCount: 1 } });

    return res.status(201).json({
      success: true,
      message: 'AI mock endpoint created.',
      data: {
        id:      mock._id,
        liveUrl: buildLiveUrl(req, user.username, slug),
        endpoint: slug,
        payload,
      },
    });
  } catch (err) {
    // Duplicate slug
    if (err.code === 11000) {
      return res.status(409).json({ success: false, message: 'An endpoint with that name already exists.' });
    }
    next(err);
  }
};

// ─── Controller: createEndpointModeB (Manual JSON) ───────────────────────────
/**
 * POST /api/endpoints/manual
 * Body: { endpointName: string, payload: Array|Object }
 * Auth: required
 */
exports.createEndpointModeB = async (req, res, next) => {
  try {
    const { endpointName, payload } = req.body;

    if (!endpointName?.trim()) return res.status(400).json({ success: false, message: '`endpointName` is required.' });
    if (payload === undefined)  return res.status(400).json({ success: false, message: '`payload` is required.' });

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });

    // Quota check
    if (false && user.endpointCount >= (user.isPro ? 100 : 10)) {
      return res.status(403).json({
        success: false,
        message: `Endpoint limit reached (${user.isPro ? 100 : 10}). ${user.isPro ? '' : 'Upgrade to Pro for more.'}`.trim(),
      });
    }

    // ── Payload size enforcement ──
    const sizeError = checkPayloadSize(payload, user.isPro);
    if (sizeError) return res.status(sizeError.status).json({ success: false, message: sizeError.message });

    const slug = endpointName.trim().toLowerCase().replace(/\s+/g, '-');

    const mock = await MockEndpoint.create({
      owner:            user._id,
      username:         user.username,
      endpoint:         slug,
      payload,
      payloadSizeBytes: jsonByteSize(payload),
      mode:             'manual',
    });

    await User.findByIdAndUpdate(user._id, { $inc: { endpointCount: 1 } });

    return res.status(201).json({
      success: true,
      message: 'Manual mock endpoint created.',
      data: {
        id:      mock._id,
        liveUrl: buildLiveUrl(req, user.username, slug),
        endpoint: slug,
        payload,
      },
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ success: false, message: 'An endpoint with that name already exists.' });
    }
    next(err);
  }
};

// ─── Controller: serveMockData (Public dynamic GET) ───────────────────────────
/**
 * GET /api/:username/:endpointName
 * Auth: none — public consumer route
 */
exports.serveMockData = async (req, res, next) => {
  try {
    const { username, endpointName } = req.params;

    const mock = await MockEndpoint.findOne({
      username: username.toLowerCase(),
      endpoint: endpointName.toLowerCase(),
      isActive: true,
    }).lean();

    if (!mock) {
      return res.status(404).json({
        success: false,
        message: `No active mock found at /${username}/${endpointName}`,
      });
    }

    // Non-blocking hit tracking
    MockEndpoint.findByIdAndUpdate(mock._id, {
      $inc: { hitCount: 1 },
      $set: { lastHitAt: new Date() },
    }).exec().catch(() => {});

    // Apply stored custom response headers
    if (mock.responseHeaders) {
      for (const [key, val] of Object.entries(mock.responseHeaders)) {
        res.setHeader(key, val);
      }
    }

    return res.status(mock.statusCode || 200).json(mock.payload);
  } catch (err) {
    next(err);
  }
};

// ─── Controller: updateEndpoint (PUT) ────────────────────────────────────────
/**
 * PUT /api/endpoints/:id
 * Body: { payload: Array|Object, endpointName?: string }
 * Auth: required — owner only
 */
exports.updateEndpoint = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { payload, endpointName } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid endpoint ID.' });
    }

    if (payload === undefined) {
      return res.status(400).json({ success: false, message: '`payload` is required.' });
    }

    const mock = await MockEndpoint.findById(id);
    if (!mock) return res.status(404).json({ success: false, message: 'Endpoint not found.' });

    // Ownership check
    if (mock.owner.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Forbidden: you do not own this endpoint.' });
    }

    // ── Payload size enforcement ──
    const sizeError = checkPayloadSize(payload, req.user.isPro);
    if (sizeError) return res.status(sizeError.status).json({ success: false, message: sizeError.message });

    mock.payload          = payload;
    mock.payloadSizeBytes = jsonByteSize(payload);

    if (endpointName?.trim()) {
      mock.endpoint = endpointName.trim().toLowerCase().replace(/\s+/g, '-');
    }

    await mock.save();

    return res.json({
      success: true,
      message: 'Endpoint updated.',
      data: {
        id:      mock._id,
        liveUrl: buildLiveUrl(req, mock.username, mock.endpoint),
        endpoint: mock.endpoint,
        payload:  mock.payload,
      },
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ success: false, message: 'An endpoint with that name already exists.' });
    }
    next(err);
  }
};

// ─── Controller: deleteEndpoint (DELETE) ─────────────────────────────────────
/**
 * DELETE /api/endpoints/:id
 * Auth: required — owner only
 */
exports.deleteEndpoint = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid endpoint ID.' });
    }

    const mock = await MockEndpoint.findById(id);
    if (!mock) return res.status(404).json({ success: false, message: 'Endpoint not found.' });

    if (mock.owner.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Forbidden: you do not own this endpoint.' });
    }

    await mock.deleteOne();
    await User.findByIdAndUpdate(req.user.id, { $inc: { endpointCount: -1 } });

    return res.json({ success: true, message: 'Endpoint deleted.' });
  } catch (err) {
    next(err);
  }
};

// ─── Controller: listEndpoints (GET — dashboard helper) ──────────────────────
/**
 * GET /api/endpoints
 * Auth: required — returns the authenticated user's endpoints
 */
exports.listEndpoints = async (req, res, next) => {
  try {
    const page  = Math.max(1, parseInt(req.query.page,  10) || 1);
    const limit = Math.min(50, parseInt(req.query.limit, 10) || 20);
    const skip  = (page - 1) * limit;

    const [mocks, total] = await Promise.all([
      MockEndpoint.find({ owner: req.user.id, isActive: true })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .select('-payload') // Omit heavy payload from list view
        .lean(),
      MockEndpoint.countDocuments({ owner: req.user.id, isActive: true }),
    ]);

    return res.json({
      success: true,
      data: mocks,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (err) {
    next(err);
  }
};
