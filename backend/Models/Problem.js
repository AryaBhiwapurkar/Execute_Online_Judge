const mongoose = require('mongoose');

const problemSchema = new mongoose.Schema({
  problemId: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  difficulty: { type: String, enum: ["Easy", "Medium", "Hard"], required: true },
  problemStatement: { type: String, required: true },
  inputFormat: { type: String, required: true },
  outputFormat: { type: String, required: true },
  constraints: { type: String, required: true },
  sampleInput: { type: String, required: true },
  sampleOutput: { type: String, required: true },

  // ✅ Add this field
  testcases: [
    {
      input: { type: String, required: true },
      output: { type: String, required: true }
    }
  ],

  timeLimit: {
    type: Number, // milliseconds
    required: true,
    default: 1000,
  },
  memoryLimit: {
    type: Number, // megabytes
    required: true,
    default: 256,
  }
});

// ✅ Export a function that takes a DB connection
module.exports = (connection) => {
  if (connection.models.Problem) {
    return connection.models.Problem;
  }
  return connection.model("Problem", problemSchema);
};
