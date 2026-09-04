const validateBasicRequest = (req, res, next) => {
  const {
    full_name,
    national_id,
    address,
    phone
  } = req.body;

  // ==========================
  // Full Name
  // ==========================

  if (!full_name || !full_name.trim()) {
    return res.status(400).json({
      message: "validation.fullNameRequired"
    });
  }

  const name = full_name.trim();

  if (name.length < 5) {
    return res.status(400).json({
      message: "validation.fullNameMinLength"
    });
  }

  if (name.length > 100) {
    return res.status(400).json({
      message: "validation.fullNameMaxLength"
    });
  }

  // يجب أن يحتوي كلمتين على الأقل
  if (name.split(/\s+/).length < 2) {
    return res.status(400).json({
      message: "validation.fullNameTwoWords"
    });
  }

  // يمنع الأرقام والرموز
  if (!/^[\u0600-\u06FFa-zA-Z\s]+$/.test(name)) {
    return res.status(400).json({
      message: "validation.invalidFullName"
    });
  }

  // ==========================
  // National ID
  // ==========================

  if (!national_id || !national_id.trim()) {
    return res.status(400).json({
      message: "validation.nationalIdRequired"
    });
  }

  if (!/^[0-9]{8,20}$/.test(national_id.trim())) {
    return res.status(400).json({
      message: "validation.invalidNationalId"
    });
  }

  // ==========================
  // Address
  // ==========================

  if (!address || !address.trim()) {
    return res.status(400).json({
      message: "validation.addressRequired"
    });
  }

  const addr = address.trim();

  if (addr.length < 5) {
    return res.status(400).json({
      message: "validation.addressMinLength"
    });
  }

  if (addr.length > 255) {
    return res.status(400).json({
      message: "validation.addressMaxLength"
    });
  }

  // ==========================
  // Phone (اختياري)
  // ==========================


  next();
};

module.exports = {
  validateBasicRequest
};