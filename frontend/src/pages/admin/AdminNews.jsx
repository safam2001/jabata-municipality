
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";

import "./AdminNews.css";

const AdminNews = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [openSettings, setOpenSettings] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="admin-news-layout">

      {/* =========================
          Mobile Toggle
      ========================= */}

      <button
        className="news-mobile-toggle"
        onClick={() => setSidebarOpen(!sidebarOpen)}
        aria-label="Toggle News Sidebar"
      >
        {sidebarOpen ? <FaTimes /> : <FaBars />}
      </button>


      {/* =========================
          News Sidebar
      ========================= */}

      <aside
        className={`sidebar ${
          sidebarOpen ? "mobile-open" : ""
        }`}
      >

        <h2 className="title">
          {t("adminNews")}
        </h2>


        {/* Back */}

        <button
          className="back-btn"
          onClick={() => {
            closeSidebar();
            navigate("/admin/dashboard");
          }}
        >
          {t("backToDashboard")}
        </button>


        {/* Menu */}

        <nav className="menu">

          {/* News List */}

          <NavLink
            to="/admin/news"
            end
            onClick={closeSidebar}
          >
            {t("newsList")}
          </NavLink>


          {/* Create News */}

          <NavLink
            to="/admin/news/create"
            onClick={closeSidebar}
          >
            {t("createNews")}
          </NavLink>


          {/* Media */}

          <NavLink
            to="/admin/news/media"
            onClick={closeSidebar}
          >
            {t("mediaManager")}
          </NavLink>


          {/* Drafts */}

          <NavLink
            to="/admin/news/drafts"
            onClick={closeSidebar}
          >
            {t("draftNews")}
          </NavLink>


          {/* Settings */}

          <div className="menu-item">

            <div
              className="menu-title"
              onClick={() =>
                setOpenSettings(!openSettings)
              }
            >
              ⚙️ {t("settings")}
            </div>


            {openSettings && (
              <div className="submenu">

                <NavLink
                  to="/admin/news/settings/villages"
                  onClick={closeSidebar}
                >
                  {t("manageVillages")}
                </NavLink>


                <NavLink
                  to="/admin/news/settings/towns"
                  onClick={closeSidebar}
                >
                  {t("manageTowns")}
                </NavLink>


                <NavLink
                  to="/admin/news/settings/comments"
                  onClick={closeSidebar}
                >
                  {t("manageComments")}
                </NavLink>

              </div>
            )}

          </div>

        </nav>

      </aside>


      {/* =========================
          Content
      ========================= */}

      <main className="content">
        <Outlet />
      </main>

    </div>
  );
};

export default AdminNews;