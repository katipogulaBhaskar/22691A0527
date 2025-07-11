import fs from 'fs';
import path from 'path';

// Create logs directory if it doesn't exist
const logDirectory = path.resolve('logs');
if (!fs.existsSync(logDirectory)) {
  fs.mkdirSync(logDirectory);
}

// Log file path
const logFile = path.join(logDirectory, 'access.log');

const loggerMiddleware = (req, res, next) => {
  const { method, url } = req;
  const timestamp = new Date().toISOString();
  const ip = req.ip;
  const userAgent = req.get('User-Agent') || 'Unknown';

  const logEntry = `[${timestamp}] ${method} ${url} | IP: ${ip} | UA: ${userAgent}\n`;

  // Append to log file
  fs.appendFile(logFile, logEntry, (err) => {
    if (err) {
      // Optionally handle logging failure
      console.error('Failed to write log:', err);
    }
  });

  next();
};

export default loggerMiddleware;
