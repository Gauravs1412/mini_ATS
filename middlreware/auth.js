const jwt = require("jsonwebtoken");

// Hardcoded user
const HARD_CODED_USER = {
  email: "admin@ats.com",
  password: "admin123", // store in .env or hashed in production
};

const JWT_SECRET = process.env.JWT_SECRET || "super_secret_key";

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Access token missing" });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: "Invalid token" });

    if (user.email !== HARD_CODED_USER.email) {
      return res.status(403).json({ error: "Unauthorized user" });
    }

    req.user = user;
    next();
  });
};

module.exports = { authenticateToken, HARD_CODED_USER, JWT_SECRET };
