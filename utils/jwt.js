const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET || "your_super_secret_key";

const generateToken = (user) => {
  // Don't include sensitive info like password
  return jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
    expiresIn: "1h", // Token validity
  });
};

module.exports = generateToken;
