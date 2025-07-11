import fs from 'fs';
import path from 'path';
import axios from 'axios';

// Create a 'logs' directory if it doesn't exist
const logDirectory = path.resolve('logs');
if (!fs.existsSync(logDirectory)) {
  fs.mkdirSync(logDirectory);
}
const logFile = path.join(logDirectory, 'access.log');

// Function to send logs to the evaluation server
const logToServer = async (stack, level, pkg, message) => {
  try {
    await axios.post('http://20.244.56.144/evaluation-service/logs', {
      stack,
      level,
      package: pkg,
      message,
    });
  } catch (err) {
    console.error('Failed to send log to test server:', err.message);
  }
};

// Logger middleware
const loggerMiddleware = async (req, res, next) => {
  const { method, url } = req;
  const timestamp = new Date().toISOString();
  const ip = req.ip;
  const userAgent = req.get('User-Agent') || 'Unknown';

  const localLog = `[${timestamp}] ${method} ${url} | IP: ${ip} | UA: ${userAgent}\n`;

  // Append to local log file
  fs.appendFile(logFile, localLog, (err) => {
    if (err) {
      console.error('Failed to write to local log file:', err);
    }
  });

  // Send log to remote server
  await logToServer('backend', 'info', 'middleware', `Incoming ${method} request to ${url} from ${ip}`);

  next();
};

export default loggerMiddleware;
