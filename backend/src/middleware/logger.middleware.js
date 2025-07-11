import fs from 'fs';
import path from 'path';
import axios from 'axios';


const logDirectory = path.resolve('logs');
if (!fs.existsSync(logDirectory)) {
  fs.mkdirSync(logDirectory);
}
const logFile = path.join(logDirectory, 'access.log');


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


const loggerMiddleware = async (req, res, next) => {
  const { method, url } = req;
  const timestamp = new Date().toISOString();
  const ip = req.ip;
  const userAgent = req.get('User-Agent') || 'Unknown';

  const localLog = `[${timestamp}] ${method} ${url} | IP: ${ip} | UA: ${userAgent}\n`;

  fs.appendFile(logFile, localLog, (err) => {
    if (err) {
      console.error('Failed to write to local log file:', err);
    }
  });


  await logToServer('backend', 'info', 'middleware', `Incoming ${method} request to ${url} from ${ip}`);

  next();
};

export default loggerMiddleware;
