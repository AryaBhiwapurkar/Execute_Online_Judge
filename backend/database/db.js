// ✅ backend/database/db.js

const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("✅ Auth MongoDB connected");
  } catch (error) {
    console.error("❌ Auth MongoDB connection failed", error);
    process.exit(1);
  }
};

module.exports = connectDB;
