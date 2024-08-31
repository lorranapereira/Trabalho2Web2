// src/middleware/requestLogger.js

const requestLogger = (req, res, next) => {
  const currentTime = new Date().toISOString();
  const clientIp = req.ip || req.connection.remoteAddress;
  console.log(`[${currentTime}] ${req.method} ${req.url} - IP: ${clientIp}`);
  next();
};

module.exports = requestLogger;
