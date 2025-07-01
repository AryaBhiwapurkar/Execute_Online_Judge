const mongoose = require('mongoose'); // ✅ Don't destructure
const dotenv = require('dotenv');
dotenv.config();

const connectProblemDB = async () => {
  try {
    const problemMongoose = new mongoose.Mongoose(); // ✅ new isolated mongoose instance

    const conn = await problemMongoose.connect(process.env.MONGO_DB_PROBLEMS, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("✅ Problems DB connected successfully");
    console.log("Connected to:", conn.connection.name); // 🧠 should say "OnlineJudge"

    global.problemDB = conn.connection; // ✅ assign the actual `mongoose.Connection` object
  } catch (err) {
    console.error("❌ Problems DB connection failed:", err);
    process.exit(1);
  }
};

module.exports = connectProblemDB;
