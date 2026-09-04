import React, { useEffect, useState } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import axiosInstance from "../api/axiosInstance";

import {
FaBars,
FaTimes,
FaChevronDown,
FaBell,
FaUserCircle,
FaSignOutAlt,
FaSignInAlt,
FaClipboardList,
} from "react-icons/fa";

import { useSiteSettings } from "../context/SiteSettingsContext";

import "./Navbar.css";

const Navbar = () => {
const { settings, loading } = useSiteSettings();
const { t, i18n } = useTranslation();
const navigate = useNavigate();

const [openDropdown, setOpenDropdown] = useState(null);
const [menuOpen, setMenuOpen] = useState(false);

const [user, setUser] = useState(null);
const [unreadCount, setUnreadCount] = useState(0);

const [languageOpen, setLanguageOpen] = useState(false);

/* =====================================================
LANGUAGE
===================================================== */
/* =====================================================
     CURRENT LANGUAGE
  ===================================================== */

  const language = i18n.language === "en" ? "en" : "ar";

  /* =====================================================
     MULTI LANGUAGE HELPER
  ===================================================== */
const getText = (field, fallback = "") => {
  if (!field) return fallback;

  // إذا كانت String تحتوي JSON
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
      // ليست JSON، نستخدمها كنص عادي
    }

    return field || fallback;
  }

  // إذا كانت Object
  if (typeof field === "object") {
    return (
      field[language] ||
      field.ar ||
      field.en ||
      fallback
    );
  }

  return fallback;
};
/* =====================================================
IMAGE URL
===================================================== */

const getImageUrl = (image) => {
if (!image) return "/logo.png";

if (image.startsWith("http")) {  
  return image;  
}  

return `http://localhost:5000/${image}`;

};

/* =====================================================
LOAD USER
===================================================== */

useEffect(() => {
const saved = localStorage.getItem("user");

if (saved) {  
  setUser(JSON.parse(saved));  
  getNotifications();  
}

}, []);

/* =====================================================
NOTIFICATIONS
===================================================== */

const getNotifications = async () => {
try {
const res = await axiosInstance.get(
"/api/notifications/my-notifications"
);

setUnreadCount(  
    res.data.filter(  
      (notification) =>  
        notification.status === "unread"  
    ).length  
  );  
} catch (err) {  
  console.log(err);  
}

};

/* =====================================================
LOGOUT
===================================================== */

const logout = () => {
localStorage.removeItem("token");
localStorage.removeItem("user");

setUser(null);  

navigate("/");

};

/* =====================================================
CLOSE MENUS
===================================================== */

const closeMenus = () => {
setMenuOpen(false);
setOpenDropdown(null);
setLanguageOpen(false);
};

/* =====================================================
CHANGE LANGUAGE
===================================================== */

const changeLanguage = (lng) => {
i18n.changeLanguage(lng);

setLanguageOpen(false);  
setOpenDropdown(null);  
setMenuOpen(false);

};

/* =====================================================
WEBSITE NAME
===================================================== */

const siteName = getText(
settings?.siteName,
t("Jibatha Al-Khashab Municipality")
);

/* =====================================================
LOADING
===================================================== */

if (loading) {
return (
<header className="navbar">
<div className="navbar-container">
<div className="navbar-logo">
<div className="logo-text">
<h3>{t("Jibatha Al-Khashab Municipality")}</h3>
</div>
</div>
</div>
</header>
);
}

return (
<header
className="navbar"
style={{
backgroundColor:
settings?.navbarColor || "#004d40",
}}
>
<div className="navbar-container">

{/* =================================================  
        LOGO  
    ================================================= */}  

    <div  
      className="navbar-logo"  
      onClick={() => navigate("/")}  
    >  
      <img  
        src={getImageUrl(settings?.logo)}  
        className="logo-img"  
        alt="logo"  
      />  

      <div className="logo-text">  
        <h3>  
          {siteName}  
        </h3>  
      </div>  
    </div>  

    {/* =================================================  
        NAVIGATION  
    ================================================= */}  

    <nav  
      className={`nav-links ${  
        menuOpen ? "active" : ""  
      }`}  
    >  

      {/* Home */}  

      <NavLink  
        to="/"  
        onClick={closeMenus}  
      >  
        {t("home")}  
      </NavLink>  

      {/* About */}  

      <NavLink  
        to="/about"  
        onClick={closeMenus}  
      >  
        {t("aboutUs")}  
      </NavLink>  

      {/* =================================================  
          SERVICES  
      ================================================= */}  

      <div className="dropdown">  

        <button  
          className="dropdown-btn"  
          onClick={() =>  
            setOpenDropdown(  
              openDropdown === "services"  
                ? null  
                : "services"  
            )  
          }  
        >  
          {t("services")}  

          <FaChevronDown />  
        </button>  

        {openDropdown === "services" && (  
          <div className="dropdown-menu">  

            <Link  
              to="/services"  
              onClick={closeMenus}  
            >  
              {t("serviceDirectory")}  
            </Link>  

          </div>  
        )}  

      </div>  

      {/* News */}  

      <NavLink  
        to="/news"  
        onClick={closeMenus}  
      >  
        {t("news")}  
      </NavLink>  

      {/* =================================================  
          MEDIA CENTER  
      ================================================= */}  

      <div className="dropdown">  

        <button  
          className="dropdown-btn"  
          onClick={() =>  
            setOpenDropdown(  
              openDropdown === "media"  
                ? null  
                : "media"  
            )  
          }  
        >  
          {t("mediaCenter")}  

          <FaChevronDown />  
        </button>  

        {openDropdown === "media" && (  
          <div className="dropdown-menu">  

            <Link  
              to="/media"  
              onClick={closeMenus}  
            >  
              {t("allMedia")}  
            </Link>  

          </div>  
        )}  

      </div>  

      {/* Villages */}  

      <NavLink  
        to="/villages"  
        onClick={closeMenus}  
      >  
        {t("villages")}  
      </NavLink>  

      {/* Contact */}  

      <NavLink  
        to="/contact"  
        onClick={closeMenus}  
      >  
        {t("contactUs")}  
      </NavLink>  

      {/* =================================================  
          LANGUAGE  
      ================================================= */}  

          <div className="dropdown">

            <button
              type="button"
              className="dropdown-btn"
              onClick={() => {
                setLanguageOpen(!languageOpen);
                setOpenDropdown(null);
              }}
            >
              🌐

              {language === "ar"
                ? "العربية"
                : "English"}

              <FaChevronDown />
            </button>

            {languageOpen && (
              <div className="dropdown-menu">

                <button
                  type="button"
                  onClick={() =>
                    changeLanguage("ar")
                  }
                >
                  العربية
                </button>

                <button
                  type="button"
                  onClick={() =>
                    changeLanguage("en")
                  }
                >
                  English
                </button>

              </div>
            )}

          </div>

      {/* =================================================  
          USER AREA  
      ================================================= */}  

      {user ? (  
        <>  
          {/* My Requests */}  

          <NavLink  
            to="/my-requests"  
            onClick={closeMenus}  
            className="user-link"  
          >  
            <FaClipboardList />  

            {t("My Requests")}  
          </NavLink>  

          {/* Notifications */}  

          <NavLink  
            to="/notifications"  
            onClick={closeMenus}  
            className="notification-link"  
          >  
            <FaBell />  

            {unreadCount > 0 && (  
              <span className="notification-badge">  
                {unreadCount}  
              </span>  
            )}  
          </NavLink>  

          {/* Profile */}  

          <div className="dropdown">  

            <button  
              className="dropdown-btn"  
              onClick={() =>  
                setOpenDropdown(  
                  openDropdown === "profile"  
                    ? null  
                    : "profile"  
                )  
              }  
            >  
              <FaUserCircle />  

              {user.firstName}  

              <FaChevronDown />  
            </button>  

            {openDropdown === "profile" && (  
              <div className="dropdown-menu">  

                <Link  
                  to="/profile"  
                  onClick={closeMenus}  
                >  
                  <FaUserCircle />  

                  {t("myProfile")}  
                </Link>  

                <button  
                  type="button"  
                  onClick={logout}  
                >  
                  <FaSignOutAlt />  

                  {t("Logout")}  
                </button>  

              </div>  
            )}  

          </div>  
        </>  
      ) : (  
        /* =================================================  
           LOGIN  
        ================================================= */  

        <NavLink  
          to="/login"  
          onClick={closeMenus}  
        >  
          <FaSignInAlt />  

          {t("Login")}  
        </NavLink>  
      )}  

    </nav>  

    {/* =================================================  
        MOBILE MENU BUTTON  
    ================================================= */}  

    <button  
      className="menu-toggle"  
      onClick={() =>  
        setMenuOpen(!menuOpen)  
      }  
    >  
      {menuOpen ? (  
        <FaTimes />  
      ) : (  
        <FaBars />  
      )}  
    </button>  

  </div>  
</header>

);
};

export default Navbar;