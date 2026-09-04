import React, { useState } from "react";
import { Link, Outlet } from "react-router-dom";
import "./AdminLayout.css";
import { useTranslation } from "react-i18next";

const AdminLayout = () => {
  const { t, i18n } = useTranslation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);

    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";

    localStorage.setItem("language", lang);
  };

  return (
    <div className="admin-layout">

      {/* زر الهامبرغر يظهر فقط على الموبايل */}
      <button
        className="menu-toggle"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        ☰
      </button>

      <aside className={`sidebar ${sidebarOpen ? "active" : ""}`}>

        <h2>{t("Admin")}</h2>

        {/* Language Switcher */}
        <div className="admin-language-switcher">

          <button
            type="button"
            className={i18n.language === "ar" ? "active" : ""}
            onClick={() => changeLanguage("ar")}
          >
            العربية
          </button>

          <button
            type="button"
            className={i18n.language === "en" ? "active" : ""}
            onClick={() => changeLanguage("en")}
          >
            English
          </button>

        </div>

        <ul>

          <li>
            <Link to="/admin/dashboard">
              {t("dashboard")}
            </Link>
          </li>

          <li>
            <Link to="/admin/citizens">
              {t("citizens")}
            </Link>
          </li>

          <li>
            <Link to="/admin/martyrs">
              {t("martyrs")}
            </Link>
          </li>

          <li>
            <Link to="/admin/special-needs">
              {t("specialNeeds")}
            </Link>
          </li>

          <li>
            <Link to="/admin/services">
              {t("manageServices")}
            </Link>
          </li>

          <li>
            <Link to="/admin/services-types">
              {t("manageServicesTypes")}
            </Link>
          </li>

          <li>
            <Link to="/admin/add-person">
              {t("addPerson")}
            </Link>
          </li>

          <li>
            <Link to="/admin/requests">
              {t("requests")}
            </Link>
          </li>

          <li>
            <Link to="/admin/news">
              {t("manageNews")}
            </Link>
          </li>

          <li>
            <Link to="/admin/contact-messages">
              {t("ContactMessage")}
            </Link>
          </li>

          <li>
            <Link to="/admin/notifications">
              {t("notifications")}
            </Link>
          </li>

          <li>
            <Link to="/admin/profile">
              {t("adminProfile")}
            </Link>
          </li>

          <li>
            <Link to="/admin/about">
              {t("about")}
            </Link>
          </li>

          <li>
            <Link to="/admin/site-settings">
              {t("siteSettings")}
            </Link>
          </li>
             <li>
  <Link to="/admin/qr-code">
    {t("qrCode")}
  </Link>
</li>
          <li>
            <button
              onClick={() => {
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                window.location.href = "/login";
              }}
              className="logout-btn"
            >
              {t("logout")}
            </button>
          </li>

        </ul>

      </aside>

      <main className="admin-content">
        <Outlet />
      </main>

    </div>
  );
};

export default AdminLayout;