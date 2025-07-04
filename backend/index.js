const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const connectAuthDB = require("./database/db.js");
const connectProblemDB = require("./database/problemDB.js");
const User = require("./Models/User.js");
const { authMiddleware, isAdmin } = require("./middleware/authMiddleware.js");

const compilerRoutes = require("./compiler/compilerRoutes"); // 🛠 /api/run
const submitRoute = require("./compiler/submit.js"); // 🛠 /api/submit ✅
const { aiCodeReview } = require("./aiCodeReview");


dotenv.config();
const app = express();

// 🧱 Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(express.static(path.join(__dirname, "../frontend")));

// 🔹 Base route
app.get("/", (req, res) => {
  res.send("Online Judge running");
});

// 🔐 Register user
app.post("/register", async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ message: "Please enter all fields" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// 🔑 Login user
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Please enter email and password" });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    user.token = token;
    user.password = undefined;

    res.json({ token, user });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// 👤 Protected profile route
app.get("/profile", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// 🔒 Admin-only route
app.get("/adminpanel", authMiddleware, isAdmin, (req, res) => {
  res.json({ message: "Welcome to admin panel" });
});

// 🐞 Debug route
app.get("/seerequest", (req, res) => {
  console.log(req.headers);
  res.send("Check console");
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

// 🧩 Mount major routes
app.use("/api", compilerRoutes); // /api/run
app.use("/api/submit", submitRoute); // /api/submit ✅

const initializeApp = async () => {
  try {
    // 📦 Connect Auth DB
    await connectAuthDB();
    console.log("✅ Auth DB connected");

    // 📚 Connect Problem DB
    await connectProblemDB();
    console.log("✅ Problems DB connected");

    // 🧠 Problem routes
    const problemsRoute = require("./database/problemAPI.js");
    app.use("/api/problems", problemsRoute);

    // 🧪 Quick DB check
    app.get("/test-problems", async (req, res) => {
      try {
        if (!global.problemDB) {
          return res.status(500).json({ message: "Problems DB not connected" });
        }

        const getProblemModel = require("./Models/Problem");
        const Problem = getProblemModel(global.problemDB);
        const count = await Problem.countDocuments();

        res.json({
          message: "Problems DB working",
          totalProblems: count,
          dbState: global.problemDB.readyState,
        });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });
    app.post("/ai-review", async (req, res) => {
      const { code } = req.body;
      if (!code || code.trim() === "") {
        return res.status(400).json({
          success: false,
          error: "Empty Code! Please provide some code to execute.",
        });
      }
      try {
        const review=await aiCodeReview(code);
        res.status(200).json({review});
      } catch (error) {
        res.status(500).json({
          success: false,
          error:
            error.message ||
            error.toString() ||
            "An error occured while generating feedback",
        });
      }
    });

    // 🚀 Start server
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("❌ Failed to initialize app:", err);
    process.exit(1);
  }
};

initializeApp();
