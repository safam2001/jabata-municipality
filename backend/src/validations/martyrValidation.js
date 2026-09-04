

const validateMartyr = (req, res, next) => {

  const { birth_date, death_date } = req.body;

  if (!death_date) {
    return res.status(400).json({
      message: "validation.deathDateRequired"
    });
  }

  if (isNaN(Date.parse(death_date))) {
    return res.status(400).json({
      message: "validation.invalidDeathDate"
    });
  }

  // تاريخ الوفاة بعد الميلاد
  if (new Date(death_date) <= new Date(birth_date)) {
    return res.status(400).json({
      message: "validation.deathAfterBirth"
    });
  }

  // لا يسمح بتاريخ وفاة بالمستقبل
  if (new Date(death_date) > new Date()) {
    return res.status(400).json({
      message: "validation.deathDateFuture"
    });
  }

  next();
};

module.exports = {
  validateMartyr
};