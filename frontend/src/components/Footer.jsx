import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "./Footer.css";
import { useSiteSettings } from "../context/SiteSettingsContext";

const Footer = () => {
  const { t, i18n } = useTranslation();
  const { settings } = useSiteSettings();

  const language = i18n.language === "en" ? "en" : "ar";

const getText = (field, fallback = "") => {
  if (!field) return fallback;

  if (typeof field === "string") {
    try {
      const parsed = JSON.parse(field);

      if (parsed && typeof parsed === "object") {
        return (
          parsed[language] ||
          parsed.ar ||
          parsed.en ||
          fallback
        );
      }
    } catch (error) {
      // نص عادي
    }

    return field || fallback;
  }

  if (typeof field === "object") {
    return (
      field[language] ||
      field.ar ||
      field.en ||
      fallback
    );
  }

  return fallback;
};;

  const siteName = getText(
    settings?.siteName,
    t("municipalityName")
  );

  const description = getText(
    settings?.description,
    t("municipalityDescription")
  );

  const address = getText(
    settings?.address,
    t("Quneitra - Jabatha Al-Khashab")
  );

  const workingHours = getText(
    settings?.workingHours,
    t("defaultWorkingHours")
  );

  const copyright = getText(
    settings?.copyright,
    t("allRightsReserved")
  );

  return (
    <footer
      className="footer"
      style={{
        backgroundColor:
          settings?.footerColor || "#00332d",
      }}
    >
      <div className="footer-container">

        {/* Municipality */}
        <div className="footer-section">

          <h3>
            {siteName}
          </h3>

          <p>
            {description}
          </p>

        </div>

        {/* Quick Links */}
        <div className="footer-section">

          <h4>
            {t("quickLinks")}
          </h4>

          <Link to="/">
            {t("home")}
          </Link>

          <Link to="/services">
            {t("services")}
          </Link>

          <Link to="/news">
            {t("news")}
          </Link>

          <Link to="/contact">
            {t("contactUs")}
          </Link>

        </div>

        {/* Contact */}
        <div className="footer-section">

          <h4>
            {t("contact")}
          </h4>

          <p>
            {t("address")}: {address}
          </p>

          <p>
            {t("phone")}:{" "}

            <span
              dir="ltr"
            >
              {settings?.phone || "-"}
            </span>
          </p>

          <p>
            {t("email")}:{" "}
            {settings?.email || "-"}
          </p>

          {settings?.whatsapp && (
            <p>
              {t("whatsapp")}:{" "}
              <span dir="ltr">
                {settings.whatsapp}
              </span>
            </p>
          )}

        </div>

        {/* Working Hours */}
        <div className="footer-section">

          <h4>
            {t("workingHours")}
          </h4>

          <p>
            {workingHours}
          </p>

        </div>

      </div>

      {/* Footer Bottom */}
      <div className="footer-bottom">

        <p>
          © {new Date().getFullYear()}{" "}
          {siteName} | {copyright}
        </p>

        <p>
          {t("developedBy")}{" "}

          <strong>
            {settings?.developerName || "Mriwed"}
          </strong>
        </p>

      </div>

    </footer>
  );
};

export default Footer;