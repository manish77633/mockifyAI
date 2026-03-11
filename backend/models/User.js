const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String, required: true, unique: true,
      trim: true, lowercase: true,
      match: [/^[a-z0-9_-]{3,30}$/, 'Username must be 3-30 chars: letters, numbers, _ or -'],
    },
    email: {
      type: String, required: true, unique: true,
      trim: true, lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Invalid email format'],
    },
    password:      { type: String, required: true, minlength: 8, select: false },
    isPro:         { type: Boolean, default: false },
    endpointCount: { type: Number, default: 0 },
    refreshToken:  { type: String, select: false },
  },
  { timestamps: true }
);

userSchema.virtual('maxEndpoints').get(function () { return this.isPro ? 100 : 10; });

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

userSchema.methods.toSafeObject = function () {
  const obj = this.toObject({ virtuals: true });
  delete obj.password; delete obj.refreshToken;
  return obj;
};

module.exports = mongoose.model('User', userSchema);
