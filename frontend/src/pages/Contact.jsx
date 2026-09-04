import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  FaPhone,
  FaWhatsapp,
  FaEnvelope,
  FaMapMarkerAlt,
  FaClock,
  FaPaperPlane,
} from "react-icons/fa";

import axiosInstance from "../api/axiosInstance";
import { useSiteSettings } from "../context/SiteSettingsContext";

import "./Contact.css";

const Contact = () => {
  const { t, i18n } = useTranslation();
  const { settings, loading } = useSiteSettings();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  // =========================
  // CURRENT LANGUAGE
  // =========================

  const language =
    i18n.resolvedLanguage === "en" ? "en" : "ar";

  // =========================
  // MULTI LANGUAGE TEXT
  // Same logic used in Footer
  // =========================

  const getText = (field, fallback = "") => {
    if (field === null || field === undefined) {
      return fallback;
    }

    let value = field;

    // JSON string
    if (typeof value === "string") {
      const trimmed = value.trim();

      if (!trimmed) {
        return fallback;
      }

      try {
        const parsed = JSON.parse(trimmed);

        if (
          parsed &&
          typeof parsed === "object" &&
          !Array.isArray(parsed)
        ) {
          value = parsed;
        } else {
          return trimmed;
        }
      } catch {
        return trimmed;
      }
    }

    // Localized object
    if (
      typeof value === "object" &&
      value !== null &&
      !Array.isArray(value)
    ) {
      const selected = value[language];

      if (
        typeof selected === "string" &&
        selected.trim()
      ) {
        return selected.trim();
      }

      // English fallback -> Arabic
      if (
        language === "en" &&
        typeof value.ar === "string" &&
        value.ar.trim()
      ) {
        return value.ar.trim();
      }

      // Arabic fallback -> English
      if (
        language === "ar" &&
        typeof value.en === "string" &&
        value.en.trim()
      ) {
        return value.en.trim();
      }

      return fallback;
    }

    return fallback;
  };

  // =========================
  // Handle Form Change
  // =========================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =========================
  // Send Contact Message
  // =========================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSending(true);
    setSuccess("");
    setError("");

    try {
      await axiosInstance.post("/api/contacts", {
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        subject: formData.subject.trim(),
        message: formData.message.trim(),
      });

      setSuccess(t("messageSentSuccessfully"));

      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });
    } catch (err) {
      console.error("Contact Form Error:", err);

      setError(
        err.response?.data?.message ||
          t("failedToSendMessage")
      );
    } finally {
      setSending(false);
    }
  };

  // =========================
  // Loading
  // =========================

  if (loading) {
    return (
      <div className="contact-loading">
        {t("loading")}
      </div>
    );
  }

  return (
    <div
      className={`contact-page ${
        language === "ar" ? "rtl" : "ltr"
      }`}
      dir={language === "ar" ? "rtl" : "ltr"}
    >

      {/* =========================
          Header
      ========================= */}

      <section className="contact-header">

        <h1>
          {t("contactUs")}
        </h1>

        <p>
          {t(
            "We are here to help you. Contact Jubata Al-Khashab Municipality."
          )}
        </p>

      </section>

      {/* =========================
          Contact Content
      ========================= */}

      <section className="contact-container">

        {/* =========================
            Municipality Information
        ========================= */}

        <div className="contact-info">

          <h2>
            {t("contactInformation")}
          </h2>

          {/* Address */}

          <div className="contact-info-item">

            <div className="contact-icon">
              <FaMapMarkerAlt />
            </div>

            <div>

              <h4>
                {t("address")}
              </h4>

              <p>
                {getText(
                  settings?.address,
                  "-"
                )}
              </p>

            </div>

          </div>

          {/* Phone */}

          <div className="contact-info-item">

            <div className="contact-icon">
              <FaPhone />
            </div>

            <div>

              <h4>
                {t("phone")}
              </h4>

              <p>
                {settings?.phone || "-"}
              </p>

            </div>

          </div>

          {/* WhatsApp */}

          {settings?.whatsapp && (
            <div className="contact-info-item">

              <div className="contact-icon">
                <FaWhatsapp />
              </div>

              <div>

                <h4>
                  {t("whatsapp")}
                </h4>

                <p>
                  {settings.whatsapp}
                </p>

              </div>

            </div>
          )}

          {/* Email */}

          <div className="contact-info-item">

            <div className="contact-icon">
              <FaEnvelope />
            </div>

            <div>

              <h4>
                {t("email")}
              </h4>

              <p>
                {settings?.email || "-"}
              </p>

            </div>

          </div>

          {/* Working Hours */}

          <div className="contact-info-item">

            <div className="contact-icon">
              <FaClock />
            </div>

            <div>

              <h4>
                {t("workingHours")}
              </h4>

              <p>
                {getText(
                  settings?.workingHours,
                  "-"
                )}
              </p>

            </div>

          </div>

        </div>

        {/* =========================
            Contact Form
        ========================= */}

        <div className="contact-form-box">

          <h2>
            {t("sendUsAMessage")}
          </h2>

          <p>
            {t("sendMessageDescription")}
          </p>

          {/* Success */}

          {success && (
            <div className="contact-success">
              {success}
            </div>
          )}

          {/* Error */}

          {error && (
            <div className="contact-error">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>

            {/* Name */}

            <div className="form-group">

              <label htmlFor="contact-name">
                {t("name")}
              </label>

              <input
                id="contact-name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder={t("enterYourName")}
                required
              />

            </div>

            {/* Email */}

            <div className="form-group">

              <label htmlFor="contact-email">
                {t("email")}
              </label>

              <input
                id="contact-email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder={t("enterYourEmail")}
                required
              />

            </div>

            {/* Phone */}

            <div className="form-group">

              <label htmlFor="contact-phone">
                {t("phone")}
              </label>

              <input
                id="contact-phone"
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder={t("enterYourPhone")}
              />

            </div>

            {/* Subject */}

            <div className="form-group">

              <label htmlFor="contact-subject">
                {t("subject")}
              </label>

              <input
                id="contact-subject"
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder={t("enterMessageSubject")}
                required
              />

            </div>

            {/* Message */}

            <div className="form-group">

              <label htmlFor="contact-message">
                {t("message")}
              </label>

              <textarea
                id="contact-message"
                name="message"
                rows="6"
                value={formData.message}
                onChange={handleChange}
                placeholder={t("writeYourMessage")}
                required
              />

            </div>

            {/* Submit */}

            <button
              type="submit"
              className="contact-submit-btn"
              disabled={sending}
            >

              <FaPaperPlane />

              {sending
                ? t("sending")
                : t("sendMessage")}

            </button>

          </form>

        </div>

      </section>

      {/* =========================
          Map
      ========================= */}

      <section className="contact-location">

        <div className="contact-location-header">

          <span className="contact-small-title">
            {t("ourLocation")}
          </span>

          <h2>
            {t("Jabata Al Khashab Municipality")}
          </h2>

          <p>
            {getText(
              settings?.address,
              t("Jabata Al Khashab")
            )}
          </p>

        </div>

        <div className="contact-location-grid">

          {/* =========================
              LOCATION INFO
          ========================= */}

          <div className="contact-location-info">

            <div className="contact-location-info-icon">
              <FaMapMarkerAlt />
            </div>

            <span className="contact-small-title">
              {t("Location")}
            </span>

            <h3>
              {getText(
                settings?.address,
                t("Jabata Al Khashab")
              )}
            </h3>

            <p>
              {t(
                "Located in Quneitra Governorate in the Syrian Arab Republic."
              )}
            </p>

            <div className="contact-location-details">

              <div>

                <FaMapMarkerAlt />

                <span>
                  {getText(
                    settings?.address,
                    "-"
                  )}
                </span>

              </div>

              {settings?.workingHours && (
                <div>

                  <FaClock />

                  <span>
                    {getText(
                      settings.workingHours,
                      "-"
                    )}
                  </span>

                </div>
              )}

            </div>

          </div>

          {/* =========================
              GOOGLE MAP
          ========================= */}

          <div className="contact-google-map">

            {settings?.latitude &&
            settings?.longitude ? (

              <iframe
                title="Jabata Al Khashab Municipality Location"
                src={`https://www.google.com/maps?q=${settings.latitude},${settings.longitude}&z=16&output=embed`}
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
              />

            ) : (

              <div className="contact-no-map">

                <FaMapMarkerAlt />

                <span>
                  {t("Location is not available")}
                </span>

              </div>

            )}

          </div>

        </div>

      </section>

    </div>
  );
};

export default Contact;