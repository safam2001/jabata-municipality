const logger = require('../logger');

const logMiddleware = (req, res, next) => {
  // إذا فيه مستخدم مسجل دخول
  if (req.user) {
    logger.info(
      `${req.user.role === 'admin' ? 'Admin' : 'User'} (id: ${req.user.id}) accessed ${req.method} ${req.originalUrl}`
    );
  } else {
    // إذا ما فيه توكن أو المستخدم غير معروف
    logger.info(
      `Guest accessed ${req.method} ${req.originalUrl}`
    );
  }
  next();
};

module.exports = logMiddleware;