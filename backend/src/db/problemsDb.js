const mongoose = require("mongoose");
const { env } = require("../config/env");

let problemConnection = null;

const connectProblemsDB = async () => {
  const url = env.MONGO_DB_PROBLEMS;
  if (!url) {
    throw new Error("Missing env MONGO_DB_PROBLEMS");
  }

  const problemMongoose = new mongoose.Mongoose();
  const conn = await problemMongoose.connect(url);
  problemConnection = conn.connection;
  return problemConnection;
};

const getProblemsConnection = () => {
  if (!problemConnection) {
    throw new Error(
      "Problems DB not initialized. Call connectProblemsDB() before using it."
    );
  }
  return problemConnection;
};

module.exports = { connectProblemsDB, getProblemsConnection };
