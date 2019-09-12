const jwt = require("jsonwebtoken");
const config = require("config");

module.exports = function(req, res, next) {
  // get tokent from header
  const token = req.header("x-auth-token");
  // check if not token
  if (!token) {
    return res.status(404).json({ msg: "No token, authorization denied" });
  }
  try {
    const decoded = jwt.verity(token, config.get("jwtSecret"));
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: "Token is not valid" });
  }
};
