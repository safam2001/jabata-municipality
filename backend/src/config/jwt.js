require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET || process.env.SECRET_KEY;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

// التحقق الصارم في البداية
if (!JWT_SECRET) {
  throw new Error('JWT_SECRET or SECRET_KEY must be defined in environment variables');
}

module.exports = { JWT_SECRET, JWT_EXPIRES_IN };