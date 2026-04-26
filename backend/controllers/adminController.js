const User = require('../models/User');
const MockEndpoint = require('../models/MockEndpoint');
let Payment;
try {
  Payment = require('../models/Payment');
} catch (e) {
  Payment = null;
}

const escapeRegex = (string) => string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

exports.getStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const proUsers = await User.countDocuments({ isPro: true });
    const freeUsers = totalUsers - proUsers;
    const bannedUsers = await User.countDocuments({ isBanned: true });
    const totalEndpoints = await MockEndpoint.countDocuments();

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const newUsersToday = await User.countDocuments({ createdAt: { $gte: today } });
    const newUsersThisWeek = await User.countDocuments({ createdAt: { $gte: sevenDaysAgo } });
    const newUsersThisMonth = await User.countDocuments({ createdAt: { $gte: thirtyDaysAgo } });

    const userGrowth = await User.aggregate([
      { $match: { createdAt: { $gte: thirtyDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: '%b %d', date: '$createdAt' } },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id': 1 } },
      { $project: { _id: 0, date: '$_id', count: 1 } },
    ]);

    const endpointGrowth = await MockEndpoint.aggregate([
      { $match: { createdAt: { $gte: thirtyDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: '%b %d', date: '$createdAt' } },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id': 1 } },
      { $project: { _id: 0, date: '$_id', count: 1 } },
    ]);

    return res.status(200).json({
      success: true,
      data: {
        totalUsers,
        proUsers,
        freeUsers,
        bannedUsers,
        totalEndpoints,
        newUsersToday,
        newUsersThisWeek,
        newUsersThisMonth,
        userGrowth,
        endpointGrowth,
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Server error.' });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = Math.min(parseInt(req.query.limit) || 20, 100);
    const skip = (page - 1) * limit;

    const query = {};
    if (req.query.search) {
      const searchRegex = new RegExp(escapeRegex(req.query.search), 'i');
      query.$or = [{ username: searchRegex }, { email: searchRegex }];
    }
    if (req.query.filter === 'pro') query.isPro = true;
    if (req.query.filter === 'banned') query.isBanned = true;

    const users = await User.find(query)
      .select('_id username email isPro isAdmin isBanned endpointCount createdAt')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalUsers = await User.countDocuments(query);
    const totalPages = Math.ceil(totalUsers / limit);

    return res.status(200).json({
      success: true,
      data: { users, totalUsers, page, totalPages },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Server error.' });
  }
};

exports.banUser = async (req, res) => {
  try {
    const { userId } = req.params;

    if (req.admin._id.toString() === userId) {
      return res.status(400).json({ success: false, message: 'Cannot ban yourself.' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    if (user.isAdmin) {
      return res.status(400).json({ success: false, message: 'Cannot ban another admin.' });
    }

    user.isBanned = !user.isBanned;
    await user.save();

    return res.status(200).json({
      success: true,
      data: user,
      message: user.isBanned ? 'User banned.' : 'User unbanned.',
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Server error.' });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;

    if (req.admin._id.toString() === userId) {
      return res.status(400).json({ success: false, message: 'Cannot delete yourself.' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    if (user.isAdmin) {
      return res.status(400).json({ success: false, message: 'Cannot delete another admin.' });
    }

    await MockEndpoint.deleteMany({ owner: userId });
    await user.deleteOne();

    return res.status(200).json({
      success: true,
      message: 'User and their endpoints deleted.',
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Server error.' });
  }
};

exports.getEndpoints = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = Math.min(parseInt(req.query.limit) || 20, 100);
    const skip = (page - 1) * limit;

    const endpoints = await MockEndpoint.find()
      .populate('owner', 'username email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalEndpoints = await MockEndpoint.countDocuments();
    const totalPages = Math.ceil(totalEndpoints / limit);

    return res.status(200).json({
      success: true,
      data: { endpoints, totalEndpoints, page, totalPages },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Server error.' });
  }
};

exports.deleteEndpoint = async (req, res) => {
  try {
    const { endpointId } = req.params;
    const endpoint = await MockEndpoint.findById(endpointId);

    if (!endpoint) {
      return res.status(404).json({ success: false, message: 'Endpoint not found.' });
    }

    await endpoint.deleteOne();
    await User.findByIdAndUpdate(endpoint.owner, { $inc: { endpointCount: -1 } });

    return res.status(200).json({
      success: true,
      message: 'Endpoint deleted.',
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Server error.' });
  }
};

exports.getRevenueStats = async (req, res) => {
  try {
    const PLAN_PRICE = 15;
    
    const proUsersCount = await User.countDocuments({ isPro: true });
    const totalRevenue = proUsersCount * PLAN_PRICE;
    
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const newProUsersThisMonth = await User.countDocuments({ isPro: true, createdAt: { $gte: thirtyDaysAgo } });
    const monthlyRevenue = newProUsersThisMonth * PLAN_PRICE;

    const revenueGrowth = await User.aggregate([
      { $match: { isPro: true, createdAt: { $gte: thirtyDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: '%b %d', date: '$createdAt' } },
          users: { $sum: 1 },
        },
      },
      { $sort: { '_id': 1 } },
      { $project: { _id: 0, date: '$_id', amount: { $multiply: ['$users', PLAN_PRICE] } } },
    ]);

    // Fill missing days
    const last30Days = Array.from({ length: 30 }).map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (29 - i));
      const dateStr = d.toLocaleDateString('en-US', { month: 'short', day: '2-digit' }).replace(' ', ' ');
      // Use simpler matching
      const found = revenueGrowth.find(r => r.date === dateStr);
      return {
        date: dateStr,
        amount: found ? found.amount : 0,
      };
    });

    return res.status(200).json({
      success: true,
      data: {
        totalRevenue,
        monthlyRevenue,
        last30Days,
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Server error.' });
  }
};

exports.toggleAdmin = async (req, res) => {
  try {
    const { userId } = req.params;

    if (req.admin._id.toString() === userId) {
      return res.status(400).json({ success: false, message: 'Cannot change your own role.' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    user.isAdmin = !user.isAdmin;
    await user.save();

    return res.status(200).json({
      success: true,
      data: user,
      message: user.isAdmin ? 'User is now an admin.' : 'User is no longer an admin.',
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Server error.' });
  }
};
