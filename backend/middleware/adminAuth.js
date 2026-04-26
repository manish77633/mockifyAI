const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.requireAdmin = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ success: false, message: 'Not authorized.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({ success: false, message: 'User not found.' });
    }

    if (user.isBanned) {
      return res.status(403).json({ success: false, message: 'Account banned.' });
    }

    if (user.isAdmin !== true) {
      return res.status(403).json({ success: false, message: 'Admin access required.' });
    }

    req.admin = user;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Not authorized.' });
  }
};
