

// =========================
// Register Validation
// =========================
const validateRegister = (req, res, next) => {
  let { firstName, lastName, email, password } = req.body;

  // تنظيف البيانات
  firstName = firstName?.trim();
  lastName = lastName?.trim();
  email = email?.trim().toLowerCase();

  if (!firstName || !lastName || !email || !password) {
    return res.status(400).json({
      message: "validation.allFieldsRequired"
    });
  }

  if (firstName.length < 2 || firstName.length > 50) {
    return res.status(400).json({
      message: "validation.invalidFirstName"
    });
  }

  if (lastName.length < 2 || lastName.length > 50) {
    return res.status(400).json({
      message: "validation.invalidLastName"
    });
  }

  const emailRegex =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email)) {
    return res.status(400).json({
      message: "validation.invalidEmail"
    });
  }

  if (email.length > 100) {
    return res.status(400).json({
      message: "validation.invalidEmail"
    });
  }

  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

  if (!passwordRegex.test(password)) {
    return res.status(400).json({
      message: "validation.invalidPassword"
    });
  }

  req.body.firstName = firstName;
  req.body.lastName = lastName;
  req.body.email = email;

  next();
};

// =========================
// Login Validation
// =========================
const validateLogin = (req, res, next) => {
  let { email, password } = req.body;

  email = email?.trim().toLowerCase();

  if (!email || !password) {
    return res.status(400).json({
      message: "validation.emailPasswordRequired"
    });
  }

  const emailRegex =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email)) {
    return res.status(400).json({
      message: "validation.invalidEmail"
    });
  }

  req.body.email = email;

  next();
};

module.exports = {
  validateRegister,
  validateLogin
};