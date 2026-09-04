


import React, { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import { useTranslation } from "react-i18next";

import {
  FaSave,
  FaBuilding,
  FaImage,
  FaPhone,
  FaMapMarkerAlt,
  FaFacebook,
  FaInstagram,
  FaYoutube,
  FaTelegram,
  FaGlobe,
} from "react-icons/fa";

import "./AdminSiteSettings.css";
// import LocationMap from "../../components/LocationMap";

const AdminSiteSettings = () => {
  const { t } = useTranslation();

  const [loading, setLoading] = useState(true);

  const [settings, setSettings] = useState({
    // =====================================
    // MULTILINGUAL
    // =====================================

    siteName: {
      ar: "",
      en: "",
    },

    description: {
      ar: "",
      en: "",
    },

    address: {
      ar: "",
      en: "",
    },

    workingHours: {
      ar: "",
      en: "",
    },

    copyright: {
      ar: "",
      en: "",
    },

    // =====================================
    // IMAGES
    // =====================================

    logo: "",

    // =====================================
    // CONTACT
    // =====================================

    phone: "",
    whatsapp: "",
    email: "",

    // =====================================
    // SOCIAL MEDIA
    // =====================================

    facebook: "",
    instagram: "",
    youtube: "",
    telegram: "",

    // =====================================
    // MAP
    // =====================================

    mapUrl: "",
    latitude: "",
    longitude: "",

    // =====================================
    // COLORS
    // =====================================

    primaryColor: "#004d40",
    secondaryColor: "#d4af37",
    buttonColor: "#c89b2d",
    navbarColor: "#004d40",
    footerColor: "#00332d",

    // =====================================
    // FOOTER
    // =====================================

    developerName: "",
  });

  const [logoPreview, setLogoPreview] = useState("");

  // =====================================
  // LOAD SETTINGS
  // =====================================

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);

      const res = await axiosInstance.get("/api/site-settings");

      const data = res.data?.settings || res.data || {};

      setSettings({
        // ===============================
        // MULTILINGUAL
        // ===============================

        siteName: {
          ar: data.siteName?.ar || "",
          en: data.siteName?.en || "",
        },

        description: {
          ar: data.description?.ar || "",
          en: data.description?.en || "",
        },

        address: {
          ar: data.address?.ar || "",
          en: data.address?.en || "",
        },

        workingHours: {
          ar: data.workingHours?.ar || "",
          en: data.workingHours?.en || "",
        },

        copyright: {
          ar: data.copyright?.ar || "",
          en: data.copyright?.en || "",
        },

        // ===============================
        // IMAGES
        // ===============================

        logo: data.logo || "",

        // ===============================
        // CONTACT
        // ===============================

        phone: data.phone || "",
        whatsapp: data.whatsapp || "",
        email: data.email || "",

        // ===============================
        // SOCIAL
        // ===============================

        facebook: data.facebook || "",
        instagram: data.instagram || "",
        youtube: data.youtube || "",
        telegram: data.telegram || "",

        // ===============================
        // MAP
        // ===============================

        mapUrl: data.mapUrl || "",
        latitude: data.latitude || "",
        longitude: data.longitude || "",

        // ===============================
        // COLORS
        // ===============================

        primaryColor: data.primaryColor || "#004d40",
        secondaryColor: data.secondaryColor || "#d4af37",
        buttonColor: data.buttonColor || "#c89b2d",
        navbarColor: data.navbarColor || "#004d40",
        footerColor: data.footerColor || "#00332d",

        // ===============================
        // FOOTER
        // ===============================

        developerName: data.developerName || "",
      });

      setLogoPreview(data.logo || "");
    } catch (err) {
      console.error("Failed to load settings:", err);
    } finally {
      setLoading(false);
    }
  };

  // =====================================
  // NORMAL INPUT CHANGE
  // =====================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setSettings((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =====================================
  // MULTILINGUAL CHANGE
  // =====================================

  const handleLanguageChange = (field, language, value) => {
    setSettings((prev) => ({
      ...prev,
      [field]: {
        ...prev[field],
        [language]: value,
      },
    }));
  };

  // =====================================
  // IMAGE CHANGE
  // =====================================

  const handleImageChange = (e) => {
    const { name } = e.target;

    const file = e.target.files?.[0];

    if (!file) return;

    const preview = URL.createObjectURL(file);

    if (name === "logo") {
      setLogoPreview(preview);
    }

    setSettings((prev) => ({
      ...prev,
      [name]: file,
    }));
  };

  // =====================================
  // SAVE SETTINGS
  // =====================================

  const saveSettings = async () => {
    try {
      const formData = new FormData();

      // =================================
      // MULTILINGUAL FIELDS
      // =================================

      formData.append(
        "siteName",
        JSON.stringify(settings.siteName)
      );

      formData.append(
        "description",
        JSON.stringify(settings.description)
      );

      formData.append(
        "address",
        JSON.stringify(settings.address)
      );

      formData.append(
        "workingHours",
        JSON.stringify(settings.workingHours)
      );

      formData.append(
        "copyright",
        JSON.stringify(settings.copyright)
      );

      // =================================
      // OTHER SETTINGS
      // =================================

      formData.append("phone", settings.phone);
      formData.append("whatsapp", settings.whatsapp);
      formData.append("email", settings.email);

      formData.append("facebook", settings.facebook);
      formData.append("instagram", settings.instagram);
      formData.append("youtube", settings.youtube);
      formData.append("telegram", settings.telegram);

      formData.append("mapUrl", settings.mapUrl);
      formData.append("latitude", settings.latitude);
      formData.append("longitude", settings.longitude);

      formData.append(
        "primaryColor",
        settings.primaryColor
      );

      formData.append(
        "secondaryColor",
        settings.secondaryColor
      );

      formData.append(
        "buttonColor",
        settings.buttonColor
      );

      formData.append(
        "navbarColor",
        settings.navbarColor
      );

      formData.append(
        "footerColor",
        settings.footerColor
      );

      formData.append(
        "developerName",
        settings.developerName
      );

      // =================================
      // LOGO
      // =================================

      if (settings.logo instanceof File) {
        formData.append("logo", settings.logo);
      }

      await axiosInstance.put(
        "/api/site-settings",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      alert(t("Settings saved successfully"));

      fetchSettings();
    } catch (err) {
      console.error("Save settings error:", err);

      alert(t("Failed to save settings"));
    }
  };

  // =====================================
  // LOADING
  // =====================================

  if (loading) {
    return (
      <div className="loading-box">
        {t("Loading...")}
      </div>
    );
  }

  // =====================================
  // COMPONENT
  // =====================================

  return (
    <div className="site-settings-container">

      {/* =================================
          HEADER
      ================================= */}

      <div className="page-header">

        <div>
          <h2>
            {t("Website Settings")}
          </h2>

          <p>
            {t(
              "Manage all municipality website information"
            )}
          </p>
        </div>

        <button
          className="save-btn"
          onClick={saveSettings}
        >
          <FaSave />

          {t("Save Changes")}
        </button>

      </div>

      {/* =================================
          MUNICIPALITY INFORMATION
      ================================= */}

      <div className="settings-card">

        <h3>
          <FaBuilding />

          {t("Municipality Information")}
        </h3>

        {/* ===============================
            MUNICIPALITY NAME
        =============================== */}

        <div className="multilingual-section">

          <h4>
            {t("Municipality Name")}
          </h4>

          <div className="form-grid">

            <div className="form-group">

              <label>
                {t("Arabic")}
              </label>

              <input
                dir="rtl"
                value={settings.siteName.ar}
                onChange={(e) =>
                  handleLanguageChange(
                    "siteName",
                    "ar",
                    e.target.value
                  )
                }
                placeholder="بلدية جباثا الخشب"
              />

            </div>

            <div className="form-group">

              <label>
                {t("English")}
              </label>

              <input
                dir="ltr"
                value={settings.siteName.en}
                onChange={(e) =>
                  handleLanguageChange(
                    "siteName",
                    "en",
                    e.target.value
                  )
                }
                placeholder="Jabata Al-Khashab Municipality"
              />

            </div>

          </div>

        </div>

        {/* ===============================
            DESCRIPTION
        =============================== */}

        <div className="multilingual-section">

          <h4>
            {t("Description")}
          </h4>

          <div className="form-grid">

            <div className="form-group">

              <label>
                {t("Arabic")}
              </label>

              <textarea
                dir="rtl"
                rows="4"
                value={settings.description.ar}
                onChange={(e) =>
                  handleLanguageChange(
                    "description",
                    "ar",
                    e.target.value
                  )
                }
                placeholder="وصف البلدية بالعربي"
              />

            </div>

            <div className="form-group">

              <label>
                {t("English")}
              </label>

              <textarea
                dir="ltr"
                rows="4"
                value={settings.description.en}
                onChange={(e) =>
                  handleLanguageChange(
                    "description",
                    "en",
                    e.target.value
                  )
                }
                placeholder="Municipality description in English"
              />

            </div>

          </div>

        </div>

        {/* ===============================
            LOGO
        =============================== */}

        <div className="image-upload-box">

          <div className="image-preview">

            {logoPreview ? (
              <img
                src={logoPreview}
                alt="logo"
              />
            ) : (
              <div className="empty-image">
                <FaImage />
              </div>
            )}

          </div>

          <div className="upload-info">

            <label>
              {t("Municipality Logo")}
            </label>

            <input
              type="file"
              accept="image/*"
              name="logo"
              onChange={handleImageChange}
            />

          </div>

        </div>

      </div>

      {/* =================================
          CONTACT INFORMATION
      ================================= */}

      <div className="settings-card">

        <h3>
          <FaPhone />

          {t("Contact Information")}
        </h3>

        <div className="form-grid">

          <div className="form-group">

            <label>
              {t("Phone")}
            </label>

            <input
              type="text"
              name="phone"
              value={settings.phone}
              onChange={handleChange}
              placeholder="+963..."
            />

          </div>

          <div className="form-group">

            <label>
              {t("WhatsApp")}
            </label>

            <input
              type="text"
              name="whatsapp"
              value={settings.whatsapp}
              onChange={handleChange}
              placeholder="+963..."
            />

          </div>

          <div className="form-group">

            <label>
              {t("Email")}
            </label>

            <input
              type="email"
              name="email"
              value={settings.email}
              onChange={handleChange}
              placeholder="info@example.com"
            />

          </div>

        </div>

        {/* ===============================
            ADDRESS
        =============================== */}

        <div className="multilingual-section">

          <h4>
            {t("Address")}
          </h4>

          <div className="form-grid">

            <div className="form-group">

              <label>
                {t("Arabic")}
              </label>

              <input
                dir="rtl"
                value={settings.address.ar}
                onChange={(e) =>
                  handleLanguageChange(
                    "address",
                    "ar",
                    e.target.value
                  )
                }
                placeholder="القنيطرة - جباثا الخشب"
              />

            </div>

            <div className="form-group">

              <label>
                {t("English")}
              </label>

              <input
                dir="ltr"
                value={settings.address.en}
                onChange={(e) =>
                  handleLanguageChange(
                    "address",
                    "en",
                    e.target.value
                  )
                }
                placeholder="Quneitra - Jabata Al-Khashab"
              />

            </div>

          </div>

        </div>

        {/* ===============================
            WORKING HOURS
        =============================== */}

        <div className="multilingual-section">

          <h4>
            {t("Working Hours")}
          </h4>

          <div className="form-grid">

            <div className="form-group">

              <label>
                {t("Arabic")}
              </label>

              <textarea
                dir="rtl"
                rows="3"
                value={settings.workingHours.ar}
                onChange={(e) =>
                  handleLanguageChange(
                    "workingHours",
                    "ar",
                    e.target.value
                  )
                }
                placeholder="الأحد - الخميس | 08:00 - 15:00"
              />

            </div>

            <div className="form-group">

              <label>
                {t("English")}
              </label>

              <textarea
                dir="ltr"
                rows="3"
                value={settings.workingHours.en}
                onChange={(e) =>
                  handleLanguageChange(
                    "workingHours",
                    "en",
                    e.target.value
                  )
                }
                placeholder="Sunday - Thursday | 08:00 - 15:00"
              />

            </div>

          </div>

        </div>

      </div>

      {/* =================================
          SOCIAL MEDIA
      ================================= */}

      <div className="settings-card">

        <h3>
          <FaGlobe />

          {t("Social Media")}
        </h3>

        <div className="form-grid">

          <div className="form-group">

            <label>
              <FaFacebook />
              Facebook
            </label>

            <input
              name="facebook"
              value={settings.facebook}
              onChange={handleChange}
            />

          </div>

          <div className="form-group">

            <label>
              <FaInstagram />
              Instagram
            </label>

            <input
              name="instagram"
              value={settings.instagram}
              onChange={handleChange}
            />

          </div>

          <div className="form-group">

            <label>
              <FaYoutube />
              YouTube
            </label>

            <input
              name="youtube"
              value={settings.youtube}
              onChange={handleChange}
            />

          </div>

          <div className="form-group">

            <label>
              <FaTelegram />
              Telegram
            </label>

            <input
              name="telegram"
              value={settings.telegram}
              onChange={handleChange}
            />

          </div>

        </div>

      </div>

      {/* =================================
          MAP SETTINGS
      ================================= */}

      <div className="settings-card">

        <h3>

          <FaMapMarkerAlt />

          {t("Map Settings")}

        </h3>

        <div className="form-grid">

          <div className="form-group">

            <label>
              {t("Latitude")}
            </label>

            <input
              name="latitude"
              value={settings.latitude}
              onChange={handleChange}
              placeholder="32.000000"
            />

          </div>

          <div className="form-group">

            <label>
              {t("Longitude")}
            </label>

            <input
              name="longitude"
              value={settings.longitude}
              onChange={handleChange}
              placeholder="35.000000"
            />

          </div>

        </div>

        <div className="settings-map-preview">

          <label>
            {t("Municipality Location")}
          </label>

          <LocationMap
            latitude={settings.latitude}
            longitude={settings.longitude}
            editable={true}
            onLocationChange={(lat, lng) => {

              setSettings((prev) => ({
                ...prev,

                latitude: lat.toFixed(6),
                longitude: lng.toFixed(6),

              }));

            }}
          />

        </div>

      </div>

      {/* =================================
          WEBSITE COLORS
      ================================= */}

      <div className="settings-card">

        <h3>
          {t("Website Colors")}
        </h3>

        <div className="form-grid">

          <div className="form-group">

            <label>
              {t("Primary Color")}
            </label>

            <input
              type="color"
              name="primaryColor"
              value={settings.primaryColor}
              onChange={handleChange}
            />

          </div>

          <div className="form-group">

            <label>
              {t("Secondary Color")}
            </label>

            <input
              type="color"
              name="secondaryColor"
              value={settings.secondaryColor}
              onChange={handleChange}
            />

          </div>

          <div className="form-group">

            <label>
              {t("Navbar Color")}
            </label>

            <input
              type="color"
              name="navbarColor"
              value={settings.navbarColor}
              onChange={handleChange}
            />

          </div>

          <div className="form-group">

            <label>
              {t("Footer Color")}
            </label>

            <input
              type="color"
              name="footerColor"
              value={settings.footerColor}
              onChange={handleChange}
            />

          </div>

        </div>

      </div>

      {/* =================================
          FOOTER SETTINGS
      ================================= */}

      <div className="settings-card">

        <h3>
          {t("Footer Settings")}
        </h3>

        <div className="form-grid">

          <div className="form-group">

            <label>
              {t("Developer Name")}
            </label>

            <input
              name="developerName"
              value={settings.developerName}
              onChange={handleChange}
            />

          </div>

        </div>

        {/* ===============================
            COPYRIGHT
        =============================== */}

        <div className="multilingual-section">

          <h4>
            {t("Copyright Text")}
          </h4>

          <div className="form-grid">

            <div className="form-group">

              <label>
                {t("Arabic")}
              </label>

              <input
                dir="rtl"
                value={settings.copyright.ar}
                onChange={(e) =>
                  handleLanguageChange(
                    "copyright",
                    "ar",
                    e.target.value
                  )
                }
                placeholder="جميع الحقوق محفوظة"
              />

            </div>

            <div className="form-group">

              <label>
                {t("English")}
              </label>

              <input
                dir="ltr"
                value={settings.copyright.en}
                onChange={(e) =>
                  handleLanguageChange(
                    "copyright",
                    "en",
                    e.target.value
                  )
                }
                placeholder="All Rights Reserved"
              />

            </div>

          </div>

        </div>

      </div>

      {/* =================================
          SAVE BUTTON
      ================================= */}

      <div className="bottom-save">

        <button
          className="save-btn"
          onClick={saveSettings}
        >

          <FaSave />

          {t("Save Changes")}

        </button>

      </div>

    </div>
  );
};

export default AdminSiteSettings;