const validateUpdateUser = (req, res, next) => {
  let { firstName, lastName, email, phone } = req.body;

  if (
    firstName === undefined &&
    lastName === undefined &&
    email === undefined &&
    phone === undefined
  ) {
    return res.status(400).json({
      message: "validation.noDataToUpdate",
    });
  }

  if (firstName !== undefined) {
    firstName = firstName.trim();

    if (firstName.length < 2 || firstName.length > 50) {
      return res.status(400).json({
        message: "validation.invalidFirstName",
      });
    }
  }

  if (lastName !== undefined) {
    lastName = lastName.trim();

    if (lastName.length < 2 || lastName.length > 50) {
      return res.status(400).json({
        message: "validation.invalidLastName",
      });
    }
  }

  if (email !== undefined) {
    email = email.toLowerCase().trim();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return res.status(400).json({
        message: "validation.invalidEmail",
      });
    }
  }

  if (phone !== undefined && phone !== "") {
    phone = phone.trim();

    if (!/^\+?[0-9]{8,15}$/.test(phone)) {
      return res.status(400).json({
        message: "validation.invalidPhone",
      });
    }
  }

  next();
};

const validateChangePassword = (req, res, next) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({
      message: "validation.passwordRequired",
    });
  }

  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

  if (!passwordRegex.test(newPassword)) {
    return res.status(400).json({
      message: "validation.weakPassword",
    });
  }

  if (currentPassword === newPassword) {
    return res.status(400).json({
      message: "validation.samePassword",
    });
  }

  next();
};

module.exports = {
  validateUpdateUser,
  validateChangePassword,
};