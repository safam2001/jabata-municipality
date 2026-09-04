import React, {
  useEffect,
  useState,
} from "react";

import { useTranslation } from "react-i18next";

import {
  FaSave,
  FaBuilding,
  FaHistory,
  FaBullseye,
  FaMapMarkerAlt,
  FaPhone,
  FaClock,
  FaGlobe,
  FaCheckCircle,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";

import axiosInstance from "../../api/axiosInstance";

import "./AdminAbout.css";

// =====================================================
// LOCALIZED FIELDS
// =====================================================

const localizedFields = [
  "title",
  "subtitle",
  "description",
  "history",
  "vision",
  "mission",
  "values",
  "location",
  "address",
  "working_hours",
  "working_days",
  "meta_title",
  "meta_description",
];

// =====================================================
// EMPTY LOCALIZED
// =====================================================

const emptyLocalized = () => ({
  ar: "",
  en: "",
});

// =====================================================
// NORMALIZE LOCALIZED
// =====================================================

const normalizeLocalized = (value) => {
  if (
    value === undefined ||
    value === null ||
    value === ""
  ) {
    return emptyLocalized();
  }

  // Object
  if (
    typeof value === "object" &&
    !Array.isArray(value)
  ) {
    let ar = value.ar ?? "";
    let en = value.en ?? "";

    // Fix nested JSON inside ar
    if (typeof ar === "string") {
      const trimmedAr = ar.trim();

      if (
        trimmedAr.startsWith("{") &&
        trimmedAr.endsWith("}")
      ) {
        try {
          const parsedAr = JSON.parse(
            trimmedAr
          );

          if (
            parsedAr &&
            typeof parsedAr === "object" &&
            !Array.isArray(parsedAr)
          ) {
            ar =
              typeof parsedAr.ar === "string"
                ? parsedAr.ar
                : "";

            if (
              !en &&
              typeof parsedAr.en === "string"
            ) {
              en = parsedAr.en;
            }
          }
        } catch (error) {
          // Keep original value
        }
      }
    }

    // Fix nested JSON inside en
    if (typeof en === "string") {
      const trimmedEn = en.trim();

      if (
        trimmedEn.startsWith("{") &&
        trimmedEn.endsWith("}")
      ) {
        try {
          const parsedEn = JSON.parse(
            trimmedEn
          );

          if (
            parsedEn &&
            typeof parsedEn === "object" &&
            !Array.isArray(parsedEn)
          ) {
            if (
              !ar &&
              typeof parsedEn.ar === "string"
            ) {
              ar = parsedEn.ar;
            }

            if (
              typeof parsedEn.en === "string"
            ) {
              en = parsedEn.en;
            }
          }
        } catch (error) {
          // Keep original value
        }
      }
    }

    return {
      ar:
        typeof ar === "string"
          ? ar
          : "",

      en:
        typeof en === "string"
          ? en
          : "",
    };
  }

  // String
  if (typeof value === "string") {
    const trimmed = value.trim();

    if (!trimmed) {
      return emptyLocalized();
    }

    try {
      const parsed = JSON.parse(trimmed);

      if (
        parsed &&
        typeof parsed === "object" &&
        !Array.isArray(parsed)
      ) {
        return normalizeLocalized(
          parsed
        );
      }

      if (typeof parsed === "string") {
        return {
          ar: parsed.trim(),
          en: "",
        };
      }
    } catch (error) {
      // Normal string
    }

    return {
      ar: trimmed,
      en: "",
    };
  }

  return emptyLocalized();
};

// =====================================================
// NORMALIZE ABOUT
// =====================================================

const normalizeAbout = (data) => {
  const normalized = {
    ...data,
  };

  localizedFields.forEach((field) => {
    normalized[field] =
      normalizeLocalized(
        data?.[field]
      );
  });

  normalized.latitude =
    data?.latitude ?? "";

  normalized.longitude =
    data?.longitude ?? "";

  normalized.phone =
    data?.phone ?? "";

  normalized.secondary_phone =
    data?.secondary_phone ?? "";

  normalized.email =
    data?.email ?? "";

  normalized.website =
    data?.website ?? "";

  normalized.facebook_url =
    data?.facebook_url ?? "";

  normalized.instagram_url =
    data?.instagram_url ?? "";

  normalized.youtube_url =
    data?.youtube_url ?? "";

  normalized.telegram_url =
    data?.telegram_url ?? "";

  normalized.whatsapp_number =
    data?.whatsapp_number ?? "";

  normalized.status =
    data?.status || "active";

  normalized.show_history =
    data?.show_history !== false;

  normalized.show_vision =
    data?.show_vision !== false;

  normalized.show_mission =
    data?.show_mission !== false;

  normalized.show_values =
    data?.show_values !== false;

  normalized.show_contact =
    data?.show_contact !== false;

  normalized.show_social_media =
    data?.show_social_media !== false;

  normalized.display_order =
    data?.display_order ?? 0;

  return normalized;
};

// =====================================================
// INITIAL FORM
// =====================================================

const initialForm = {
  title: emptyLocalized(),
  subtitle: emptyLocalized(),
  description: emptyLocalized(),

  history: emptyLocalized(),

  vision: emptyLocalized(),
  mission: emptyLocalized(),
  values: emptyLocalized(),

  location: emptyLocalized(),
  address: emptyLocalized(),

  latitude: "",
  longitude: "",

  phone: "",
  secondary_phone: "",
  email: "",
  website: "",

  working_hours: emptyLocalized(),
  working_days: emptyLocalized(),

  facebook_url: "",
  instagram_url: "",
  youtube_url: "",
  telegram_url: "",
  whatsapp_number: "",

  status: "active",

  show_history: true,
  show_vision: true,
  show_mission: true,
  show_values: true,
  show_contact: true,
  show_social_media: true,

  meta_title: emptyLocalized(),
  meta_description: emptyLocalized(),

  display_order: 0,
};

// =====================================================
// ADMIN ABOUT
// =====================================================

const AdminAbout = () => {
  const { t } =
    useTranslation();

  const [about, setAbout] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const [error, setError] =
    useState("");

  const [form, setForm] =
    useState(initialForm);

  // ===================================================
  // LOAD ONCE
  // ===================================================

  useEffect(() => {
    fetchAbout();
  }, []);

  // ===================================================
  // FETCH ABOUT
  // ===================================================

  const fetchAbout = async () => {
    try {
      setLoading(true);
      setError("");

      const res =
        await axiosInstance.get(
          "/api/about/admin"
        );

      const data =
        res.data?.about ||
        res.data;

      if (data) {
        const normalized =
          normalizeAbout(data);

        setAbout(normalized);
        setForm(normalized);
      } else {
        setAbout(null);
        setForm(initialForm);
      }
    } catch (err) {
      console.error(
        "Failed to load About:",
        err
      );

      /*
       * إذا ما في سجل بعد، نترك الفورم فارغ
       * حتى يسمح Controller بإنشائه أول مرة.
       */
      if (
        err.response?.status === 404
      ) {
        setAbout(null);
        setForm(initialForm);
      } else {
        setError(
          err.response?.data?.message ||
            t(
              "Failed to load About information"
            )
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // ===================================================
  // NORMAL FIELD
  // ===================================================

  const handleChange = (e) => {
    const {
      name,
      value,
      type,
      checked,
    } = e.target;

    setForm((prev) => ({
      ...prev,

      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));
  };

  // ===================================================
  // LOCALIZED FIELD
  // ===================================================

  const handleLanguageChange = (
    field,
    language,
    value
  ) => {
    setForm((prev) => ({
      ...prev,

      [field]: {
        ...(prev[field] ||
          emptyLocalized()),

        [language]: value,
      },
    }));
  };

  // ===================================================
  // BUILD JSON
  // ===================================================

  const buildPayload = () => {
    const payload = {};

    // =================================================
    // LOCALIZED
    // =================================================

    localizedFields.forEach(
      (field) => {
        const value =
          normalizeLocalized(
            form[field]
          );

        payload[field] = {
          ar: value.ar || "",
          en: value.en || "",
        };
      }
    );

    // =================================================
    // NORMAL TEXT
    // =================================================

    payload.phone =
      form.phone || "";

    payload.secondary_phone =
      form.secondary_phone || "";

    payload.email =
      form.email || "";

    payload.website =
      form.website || "";

    payload.latitude =
      form.latitude || "";

    payload.longitude =
      form.longitude || "";

    payload.facebook_url =
      form.facebook_url || "";

    payload.instagram_url =
      form.instagram_url || "";

    payload.youtube_url =
      form.youtube_url || "";

    payload.telegram_url =
      form.telegram_url || "";

    payload.whatsapp_number =
      form.whatsapp_number || "";

    // =================================================
    // STATUS
    // =================================================

    payload.status =
      form.status === "inactive"
        ? "inactive"
        : "active";

    // =================================================
    // DISPLAY
    // =================================================

    payload.show_history =
      Boolean(form.show_history);

    payload.show_vision =
      Boolean(form.show_vision);

    payload.show_mission =
      Boolean(form.show_mission);

    payload.show_values =
      Boolean(form.show_values);

    payload.show_contact =
      Boolean(form.show_contact);

    payload.show_social_media =
      Boolean(
        form.show_social_media
      );

    // =================================================
    // ORDER
    // =================================================

    payload.display_order =
      Number(form.display_order) || 0;

    return payload;
  };

  // ===================================================
  // SAVE
  // ===================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setMessage("");
      setError("");

      const payload =
        buildPayload();

      let res;

      // =================================================
      // UPDATE EXISTING SINGLE ABOUT
      // =================================================

      if (about?.id) {
        res =
          await axiosInstance.put(
            `/api/about/${about.id}`,
            payload
          );
      }

      // =================================================
      // CREATE ONLY IF THERE IS NO ABOUT
      // =================================================

      else {
        res =
          await axiosInstance.post(
            "/api/about",
            payload
          );
      }

      const data =
        res.data?.about ||
        res.data;

      if (!data) {
        throw new Error(
          "No About data returned from server"
        );
      }

      const normalized =
        normalizeAbout(data);

      setAbout(normalized);
      setForm(normalized);

      setMessage(
        t(
          "About information saved successfully"
        )
      );

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } catch (err) {
      console.error(
        "Save About Error:",
        err
      );

      console.error(
        "Response:",
        err.response?.data
      );

      setError(
        err.response?.data?.message ||
          err.message ||
          t(
            "Failed to save About information"
          )
      );
    } finally {
      setSaving(false);
    }
  };

  // ===================================================
  // LOADING
  // ===================================================

  if (loading) {
    return (
      <div className="admin-about-loading">
        <div className="admin-about-spinner" />

        <p>
          {t(
            "Loading About information..."
          )}
        </p>
      </div>
    );
  }

  // ===================================================
  // PAGE
  // ===================================================

  return (
    <div className="admin-about-page">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="admin-about-header">

        <div className="admin-about-header-info">

          <div className="admin-about-header-icon">
            <FaBuilding />
          </div>

          <div>
            <h1>
              {t("About Municipality")}
            </h1>

            <p>
              {t(
                "Manage the municipality information displayed on the About Us page"
              )}
            </p>
          </div>

        </div>

        <div
          className={`admin-about-status ${form.status}`}
        >
          {form.status === "active" ? (
            <FaCheckCircle />
          ) : (
            <FaEyeSlash />
          )}

          {form.status === "active"
            ? t("Active")
            : t("Hidden")}
        </div>

      </div>

      {/* =================================================
          ALERTS
      ================================================= */}

      {message && (
        <div className="admin-about-alert success">

          <FaCheckCircle />

          <span>
            {message}
          </span>

        </div>
      )}

      {error && (
        <div className="admin-about-alert error">

          <span>
            {error}
          </span>

        </div>
      )}

      {/* =================================================
          FORM
      ================================================= */}

      <form
        className="admin-about-form"
        onSubmit={handleSubmit}
      >

        {/* =================================================
            BASIC INFORMATION
        ================================================= */}

        <Section
          icon={<FaBuilding />}
          title={t(
            "Municipality Information"
          )}
          desc={t(
            "Basic information about the municipality"
          )}
        >

          <div className="form-grid">

            <LocalizedField
              label={t("Page Title")}
              field="title"
              value={form.title}
              onChange={
                handleLanguageChange
              }
            />

            <LocalizedField
              label={t("Subtitle")}
              field="subtitle"
              value={form.subtitle}
              onChange={
                handleLanguageChange
              }
            />

            <Field
              label={t(
                "Display Order"
              )}
              name="display_order"
              type="number"
              value={
                form.display_order
              }
              onChange={handleChange}
            />

          </div>

        </Section>

        {/* =================================================
            DESCRIPTION
        ================================================= */}

        <Section
          icon={<FaBuilding />}
          title={t(
            "About Municipality"
          )}
          desc={t(
            "Main information about the municipality"
          )}
        >

          <LocalizedTextField
            label={t("Description")}
            field="description"
            value={
              form.description
            }
            onChange={
              handleLanguageChange
            }
            rows={7}
          />

        </Section>

        {/* =================================================
            HISTORY
        ================================================= */}

        <Section
          icon={<FaHistory />}
          title={t("History")}
          desc={t(
            "Historical information about the municipality"
          )}
        >

          <LocalizedTextField
            label={t("History")}
            field="history"
            value={form.history}
            onChange={
              handleLanguageChange
            }
            rows={7}
          />

          <Switch
            name="show_history"
            checked={
              form.show_history
            }
            onChange={handleChange}
            title={t(
              "Show History"
            )}
            desc={t(
              "Display history on the public page"
            )}
          />

        </Section>

        {/* =================================================
            VISION
        ================================================= */}

        <Section
          icon={<FaBullseye />}
          title={t("Vision")}
          desc={t(
            "Define municipality vision"
          )}
        >

          <LocalizedTextField
            label={t("Vision")}
            field="vision"
            value={form.vision}
            onChange={
              handleLanguageChange
            }
            rows={4}
          />

          <Switch
            name="show_vision"
            checked={
              form.show_vision
            }
            onChange={handleChange}
            title={t(
              "Show Vision"
            )}
            desc={t(
              "Display vision on the public page"
            )}
          />

        </Section>

        {/* =================================================
            MISSION
        ================================================= */}

        <Section
          icon={<FaBullseye />}
          title={t("Mission")}
          desc={t(
            "Define municipality mission"
          )}
        >

          <LocalizedTextField
            label={t("Mission")}
            field="mission"
            value={form.mission}
            onChange={
              handleLanguageChange
            }
            rows={4}
          />

          <Switch
            name="show_mission"
            checked={
              form.show_mission
            }
            onChange={handleChange}
            title={t(
              "Show Mission"
            )}
            desc={t(
              "Display mission on the public page"
            )}
          />

        </Section>

        {/* =================================================
            VALUES
        ================================================= */}

        <Section
          icon={<FaBullseye />}
          title={t("Values")}
          desc={t(
            "Define municipality values"
          )}
        >

          <LocalizedTextField
            label={t("Values")}
            field="values"
            value={form.values}
            onChange={
              handleLanguageChange
            }
            rows={4}
          />

          <Switch
            name="show_values"
            checked={
              form.show_values
            }
            onChange={handleChange}
            title={t(
              "Show Values"
            )}
            desc={t(
              "Display values on the public page"
            )}
          />

        </Section>

        {/* =================================================
            LOCATION
        ================================================= */}

        <Section
          icon={<FaMapMarkerAlt />}
          title={t("Location")}
          desc={t(
            "Municipality location information"
          )}
        >

          <div className="form-grid">

            <LocalizedField
              label={t("Location")}
              field="location"
              value={form.location}
              onChange={
                handleLanguageChange
              }
            />

            <LocalizedField
              label={t("Address")}
              field="address"
              value={form.address}
              onChange={
                handleLanguageChange
              }
            />

            <Field
              label={t("Latitude")}
              name="latitude"
              value={
                form.latitude
              }
              onChange={handleChange}
            />

            <Field
              label={t("Longitude")}
              name="longitude"
              value={
                form.longitude
              }
              onChange={handleChange}
            />

          </div>

        </Section>

        {/* =================================================
            CONTACT
        ================================================= */}

        <Section
          icon={<FaPhone />}
          title={t(
            "Contact Information"
          )}
          desc={t(
            "Contact details displayed to visitors"
          )}
        >

          <div className="form-grid">

            <Field
              label={t("Phone")}
              name="phone"
              value={form.phone}
              onChange={handleChange}
            />

            <Field
              label={t(
                "Secondary Phone"
              )}
              name="secondary_phone"
              value={
                form.secondary_phone
              }
              onChange={handleChange}
            />

            <Field
              label={t("Email")}
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
            />

            <Field
              label={t("Website")}
              name="website"
              value={form.website}
              onChange={handleChange}
            />

          </div>

          <Switch
            name="show_contact"
            checked={
              form.show_contact
            }
            onChange={handleChange}
            title={t(
              "Show Contact"
            )}
            desc={t(
              "Display contact information"
            )}
          />

        </Section>

        {/* =================================================
            WORKING HOURS
        ================================================= */}

        <Section
          icon={<FaClock />}
          title={t("Working Hours")}
          desc={t(
            "Municipality working days and hours"
          )}
        >

          <div className="form-grid">

            <LocalizedField
              label={t(
                "Working Days"
              )}
              field="working_days"
              value={
                form.working_days
              }
              onChange={
                handleLanguageChange
              }
            />

            <LocalizedField
              label={t(
                "Working Hours"
              )}
              field="working_hours"
              value={
                form.working_hours
              }
              onChange={
                handleLanguageChange
              }
            />

          </div>

        </Section>

        {/* =================================================
            SOCIAL MEDIA
        ================================================= */}

        <Section
          icon={<FaGlobe />}
          title={t(
            "Social Media"
          )}
          desc={t(
            "Official municipality social media links"
          )}
        >

          <div className="form-grid">

            <Field
              label="Facebook"
              name="facebook_url"
              value={
                form.facebook_url
              }
              onChange={handleChange}
            />

            <Field
              label="Instagram"
              name="instagram_url"
              value={
                form.instagram_url
              }
              onChange={handleChange}
            />

            <Field
              label="YouTube"
              name="youtube_url"
              value={
                form.youtube_url
              }
              onChange={handleChange}
            />

            <Field
              label="Telegram"
              name="telegram_url"
              value={
                form.telegram_url
              }
              onChange={handleChange}
            />

            <Field
              label="WhatsApp"
              name="whatsapp_number"
              value={
                form.whatsapp_number
              }
              onChange={handleChange}
            />

          </div>

          <Switch
            name="show_social_media"
            checked={
              form.show_social_media
            }
            onChange={handleChange}
            title={t(
              "Show Social Media"
            )}
            desc={t(
              "Display social media links"
            )}
          />

        </Section>

        {/* =================================================
            SEO
        ================================================= */}

        <Section
          icon={<FaGlobe />}
          title={t(
            "SEO Settings"
          )}
          desc={t(
            "Search engine information"
          )}
        >

          <LocalizedField
            label={t("Meta Title")}
            field="meta_title"
            value={
              form.meta_title
            }
            onChange={
              handleLanguageChange
            }
          />

          <LocalizedTextField
            label={t(
              "Meta Description"
            )}
            field="meta_description"
            value={
              form.meta_description
            }
            onChange={
              handleLanguageChange
            }
            rows={4}
          />

        </Section>

        {/* =================================================
            DISPLAY SETTINGS
        ================================================= */}

        <Section
          icon={<FaEye />}
          title={t(
            "Display Settings"
          )}
          desc={t(
            "Control About page visibility"
          )}
        >

          <div className="display-settings-grid">

            <SwitchCard
              checked={
                form.status ===
                "active"
              }
              onChange={(e) => {
                setForm((prev) => ({
                  ...prev,

                  status:
                    e.target.checked
                      ? "active"
                      : "inactive",
                }));
              }}
              title={t(
                "About Page"
              )}
              desc={t(
                "Enable About page"
              )}
            />

            <SwitchCard
              checked={
                form.show_history
              }
              onChange={
                handleChange
              }
              name="show_history"
              title={t(
                "History"
              )}
              desc={t(
                "Show history"
              )}
            />

            <SwitchCard
              checked={
                form.show_vision
              }
              onChange={
                handleChange
              }
              name="show_vision"
              title={t(
                "Vision"
              )}
              desc={t(
                "Show vision"
              )}
            />

            <SwitchCard
              checked={
                form.show_mission
              }
              onChange={
                handleChange
              }
              name="show_mission"
              title={t(
                "Mission"
              )}
              desc={t(
                "Show mission"
              )}
            />

            <SwitchCard
              checked={
                form.show_values
              }
              onChange={
                handleChange
              }
              name="show_values"
              title={t(
                "Values"
              )}
              desc={t(
                "Show values"
              )}
            />

            <SwitchCard
              checked={
                form.show_contact
              }
              onChange={
                handleChange
              }
              name="show_contact"
              title={t(
                "Contact"
              )}
              desc={t(
                "Show contact"
              )}
            />

            <SwitchCard
              checked={
                form.show_social_media
              }
              onChange={
                handleChange
              }
              name="show_social_media"
              title={t(
                "Social Media"
              )}
              desc={t(
                "Show social media"
              )}
            />

          </div>

        </Section>

        {/* =================================================
            SAVE
        ================================================= */}

        <div className="admin-about-actions">

          <button
            type="submit"
            className="admin-about-save"
            disabled={saving}
          >

            {saving ? (
              <>
                <span className="button-spinner" />

                {t("Saving...")}
              </>
            ) : (
              <>
                <FaSave />

                {t(
                  "Save Changes"
                )}
              </>
            )}

          </button>

        </div>

      </form>
    </div>
  );
};

// =====================================================
// SECTION
// =====================================================

const Section = ({
  icon,
  title,
  desc,
  children,
}) => (
  <section className="admin-about-section">

    <div className="section-title">

      <div className="section-icon">
        {icon}
      </div>

      <div>
        <h2>{title}</h2>

        <p>{desc}</p>
      </div>

    </div>

    {children}

  </section>
);

// =====================================================
// NORMAL FIELD
// =====================================================

const Field = ({
  label,
  name,
  value,
  onChange,
  type = "text",
}) => (
  <div className="form-group">

    <label>{label}</label>

    <input
      type={type}
      name={name}
      value={value ?? ""}
      onChange={onChange}
    />

  </div>
);

// =====================================================
// LOCALIZED FIELD
// =====================================================

const LocalizedField = ({
  label,
  field,
  value,
  onChange,
}) => (
  <div className="form-group">

    <label>
      {label} — Arabic
    </label>

    <input
      type="text"
      dir="rtl"
      value={value?.ar ?? ""}
      onChange={(e) =>
        onChange(
          field,
          "ar",
          e.target.value
        )
      }
    />

    <label>
      {label} — English
    </label>

    <input
      type="text"
      dir="ltr"
      value={value?.en ?? ""}
      onChange={(e) =>
        onChange(
          field,
          "en",
          e.target.value
        )
      }
    />

  </div>
);

// =====================================================
// LOCALIZED TEXTAREA
// =====================================================

const LocalizedTextField = ({
  label,
  field,
  value,
  onChange,
  rows = 5,
}) => (
  <div className="form-group">

    <label>
      {label} — Arabic
    </label>

    <textarea
      rows={rows}
      dir="rtl"
      value={value?.ar ?? ""}
      onChange={(e) =>
        onChange(
          field,
          "ar",
          e.target.value
        )
      }
    />

    <label>
      {label} — English
    </label>

    <textarea
      rows={rows}
      dir="ltr"
      value={value?.en ?? ""}
      onChange={(e) =>
        onChange(
          field,
          "en",
          e.target.value
        )
      }
    />

  </div>
);

// =====================================================
// SWITCH
// =====================================================

const Switch = ({
  name,
  checked,
  onChange,
  title,
  desc,
}) => (
  <label className="switch-row">

    <div>
      <strong>{title}</strong>
      <span>{desc}</span>
    </div>

    <input
      type="checkbox"
      name={name}
      checked={checked}
      onChange={onChange}
    />

  </label>
);

// =====================================================
// SWITCH CARD
// =====================================================

const SwitchCard = ({
  name,
  checked,
  onChange,
  title,
  desc,
}) => (
  <label className="setting-card">

    <div>
      <strong>{title}</strong>
      <span>{desc}</span>
    </div>

    <input
      type="checkbox"
      name={name}
      checked={checked}
      onChange={onChange}
    />

  </label>
);

export default AdminAbout;