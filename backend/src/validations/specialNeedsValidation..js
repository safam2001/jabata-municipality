

const validateSpecialNeeds = (req, res, next) => {

  const { disability_type } = req.body;

  if (!disability_type || !disability_type.trim()) {
    return res.status(400).json({
      message: "validation.disabilityTypeRequired"
    });
  }

  if (disability_type.trim().length < 3) {
    return res.status(400).json({
      message: "validation.disabilityTypeMinLength"
    });
  }
  if (
  type === "specialNeeds" &&
  formData.disability_type === "other" &&
  !formData.other_disability?.trim()
) {
  newErrors.other_disability =
    t("validation.otherDisabilityRequired");
}

  next();
};

module.exports = {
  validateSpecialNeeds
};