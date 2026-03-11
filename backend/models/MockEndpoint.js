const mongoose = require('mongoose');

const mockEndpointSchema = new mongoose.Schema(
  {
    owner:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    username: { type: String, required: true, lowercase: true, trim: true, index: true },
    endpoint: {
      type: String, required: true, trim: true, lowercase: true,
      match: [/^[a-z0-9/_-]+$/, 'Slug may only contain letters, numbers, /, _ or -'],
    },
    payload:          { type: mongoose.Schema.Types.Mixed, required: true },
    payloadSizeBytes: { type: Number, required: true },
    mode:             { type: String, enum: ['ai', 'manual'], required: true },
    prompt:           { type: String, default: null },
    httpMethod:       { type: String, enum: ['GET','POST','PUT','PATCH','DELETE'], default: 'GET' },
    statusCode:       { type: Number, default: 200, min: 100, max: 599 },
    responseHeaders:  { type: Map, of: String, default: {} },
    isActive:         { type: Boolean, default: true },
    hitCount:         { type: Number, default: 0 },
    lastHitAt:        { type: Date, default: null },
  },
  { timestamps: true }
);

mockEndpointSchema.index({ username: 1, endpoint: 1 }, { unique: true });

module.exports = mongoose.model('MockEndpoint', mockEndpointSchema);
