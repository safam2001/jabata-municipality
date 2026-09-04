

const validateCitizen = (req, res, next) => {
  // لا يوجد حالياً شروط خاصة بالمواطن
  next();
};

module.exports = {
  validateCitizen
};