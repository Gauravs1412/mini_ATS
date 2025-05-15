const express = require("express");
const jwt = require("jsonwebtoken");
const { HARD_CODED_USER, JWT_SECRET } = require("../middlreware/auth");

const router = express.Router();

router.post("/", (req, res) => {
  const { email, password } = req.body;

  if (email !== HARD_CODED_USER.email || password !== HARD_CODED_USER.password) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const token = jwt.sign({ email: HARD_CODED_USER.email }, JWT_SECRET, { expiresIn: "2h" });
  res.json({ token });
});

module.exports = router;
