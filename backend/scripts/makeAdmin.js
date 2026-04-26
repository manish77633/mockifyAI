require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI;

async function makeAdmin() {
  if (!MONGO_URI) {
    console.error('MONGO_URI is not set in environment variables.');
    process.exit(1);
  }

  try {
    await mongoose.connect(MONGO_URI);
    
    const email = 'manishkumar20047877@gmail.com';
    const user = await User.findOne({ email });
    
    if (!user) {
      console.log(`User with email ${email} not found.`);
    } else {
      user.isAdmin = true;
      await user.save();
      console.log(`Successfully made ${email} an admin.`);
    }
  } catch (err) {
    console.error('Error making user admin:', err);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
}

makeAdmin();
