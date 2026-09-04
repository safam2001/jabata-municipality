import React from "react";
import syriaFlag from "../assets/syria-flag.svg";
const RequestForm = ({
  type,
  formData,
  errors,
  setErrors,
  handleChange,
  handleFile,
  setFormData,
  t,
}) => {

  // =========================
  // Basic Fields
  // =========================

  const renderBasicFields = () => (
    <>
      {/* Name */}

      <label className="sdt-label">
        {type === "martyr"
          ? t("martyrName")
          : type === "specialNeeds"
          ? t("beneficiaryName")
          : t("fullName")}
      </label>

      <input
        className={`sdt-input ${
          errors.full_name ? "input-error" : ""
        }`}
        name="full_name"
        value={formData.full_name}
        onChange={handleChange}
      />

      {errors.full_name && (
        <span className="error-text">
          {errors.full_name}
        </span>
      )}

      {/* National ID */}

      <label className="sdt-label">
        {t("nationalId")}
      </label>

      <input
        className={`sdt-input ${
          errors.national_id ? "input-error" : ""
        }`}
        name="national_id"
        value={formData.national_id}
        onChange={handleChange}
      />

      {errors.national_id && (
        <span className="error-text">
          {errors.national_id}
        </span>
      )}

      {/* Birth Date */}

      <label className="sdt-label">
        {t("birthDate")}
      </label>

      <input
        type="date"
        max={new Date().toISOString().split("T")[0]}
        className={`sdt-input ${
          errors.birth_date ? "input-error" : ""
        }`}
        name="birth_date"
        value={formData.birth_date}
        onChange={handleChange}
      />

      {errors.birth_date && (
        <span className="error-text">
          {errors.birth_date}
        </span>
      )}

      {/* Address */}

      <label className="sdt-label">
        {t("address")}
      </label>

      <input
        className={`sdt-input ${
          errors.address ? "input-error" : ""
        }`}
        name="address"
        value={formData.address}
        onChange={handleChange}
      />

      {errors.address && (
        <span className="error-text">
          {errors.address}
        </span>
      )}

      {/* Phone */}

      <label className="sdt-label">
        {t("phone")}
      </label>
<div className="phone-wrapper">

  <div className="phone-country">
    <img
      src={syriaFlag}
      alt="Syria"
      className="syria-flag"
    />

    <span>+963</span>
  </div>

  <input
    type="tel"
    className={`sdt-input phone-input ${
      errors.phone ? "input-error" : ""
    }`}
    name="phone"
    value={formData.phone}
    onChange={handleChange}
    placeholder="9XXXXXXXX"
    dir="ltr"
  />

</div>

{errors.phone && (
  <span className="error-text">
    {errors.phone}
  </span>
)}
    </>
  );

  // =========================
  // Martyr Fields
  // =========================

  const renderMartyrFields = () => (
    <>
      <label className="sdt-label">
        {t("deathDate")}
      </label>

      <input
        type="date"
        max={new Date().toISOString().split("T")[0]}
        className={`sdt-input ${
          errors.death_date ? "input-error" : ""
        }`}
        name="death_date"
        value={formData.death_date}
        onChange={handleChange}
      />

      {errors.death_date && (
        <span className="error-text">
          {errors.death_date}
        </span>
      )}
    </>
  );

  // =========================
  // Special Needs Fields
  // =========================

  const renderSpecialNeedsFields = () => {
    const isOther =
      formData.disability_type === "other";

    return (
      <>
        <label className="sdt-label">
          {t("disabilityType")}
        </label>

        <select
          className={`sdt-input ${
            errors.disability_type
              ? "input-error"
              : ""
          }`}
          name="disability_type"
          value={
            [
              "physical",
              "visual",
              "hearing",
              "intellectual",
              "speech",
              "multiple",
              "other",
            ].includes(formData.disability_type)
              ? formData.disability_type
              : formData.disability_type
              ? "other"
              : ""
          }
          onChange={handleChange}
        >
          <option value="">
            {t("selectDisabilityType")}
          </option>

          <option value="physical">
            {t("physicalDisability")}
          </option>

          <option value="visual">
            {t("visualDisability")}
          </option>

          <option value="hearing">
            {t("hearingDisability")}
          </option>

          <option value="intellectual">
            {t("intellectualDisability")}
          </option>

          <option value="speech">
            {t("speechDisability")}
          </option>

          <option value="multiple">
            {t("multipleDisabilities")}
          </option>

          <option value="other">
            {t("otherDisability")}
          </option>
        </select>

        {errors.disability_type && (
          <span className="error-text">
            {errors.disability_type}
          </span>
        )}

        {/* Other Disability */}

        {isOther && (
          <>
            <label className="sdt-label">
              {t("otherDisabilityType")}
            </label>

            <input
              className={`sdt-input ${
                errors.other_disability
                  ? "input-error"
                  : ""
              }`}
              name="other_disability"
              value={
                formData.other_disability || ""
              }
              onChange={handleChange}
              placeholder={t(
                "enterOtherDisability"
              )}
            />

            {errors.other_disability && (
              <span className="error-text">
                {errors.other_disability}
              </span>
            )}
          </>
        )}
      </>
    );
  };

  // =========================
  // Common End Fields
  // =========================

  const renderCommonEnd = () => (
    <>
      {/* Notes */}

      <label className="sdt-label">
        {t("notes")}
      </label>

      <textarea
        className="sdt-textarea"
        name="notes"
        value={formData.notes}
        onChange={handleChange}
      />

      {/* Documents */}

      <label className="sdt-label">
        {t("uploadDocuments")}
      </label>

      <input
        className="sdt-file"
        type="file"
        multiple
        onChange={handleFile}
      />
    </>
  );

  // =========================
  // Render
  // =========================

  return (
    <div className="form-group">

      {renderBasicFields()}

      {type === "martyr" &&
        renderMartyrFields()}

      {type === "specialNeeds" &&
        renderSpecialNeedsFields()}

      {renderCommonEnd()}

    </div>
  );
};

export default RequestForm;