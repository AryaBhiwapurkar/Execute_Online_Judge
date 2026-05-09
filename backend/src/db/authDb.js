const mongoose = require("mongoose");
const { env } = require("../config/env");

const connectAuthDB = async () => {
  const url = env.MONGODB_URL;
  if (!url) {
    throw new Error("Missing env MONGODB_URL");
  }

  await mongoose.connect(url);
  return mongoose.connection;
};

module.exports = { connectAuthDB };
