const express = require("express");
const { authMiddleware } = require("../../middleware/authMiddleware");
const { runHandler, submitHandler } = require("./judge.controller");

const router = express.Router();

router.post("/run", authMiddleware, runHandler);
router.post("/submit", authMiddleware, submitHandler);

module.exports = router;
