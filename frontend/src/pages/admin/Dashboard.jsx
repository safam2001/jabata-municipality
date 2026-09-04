import React, { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import { useTranslation } from "react-i18next";

import {
  FaUsers,
  FaNewspaper,
  FaImages,
  FaComments,
  FaTools,
  FaList,
  FaBuilding,
  FaWheelchair,
  FaMedal,
  FaRegFileAlt
} from "react-icons/fa";

import "./Dashboard.css";

const Dashboard = () => {

  const { t } = useTranslation();

  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState({
    citizens: 0,
    martyrs: 0,
    specialNeeds: 0,
    villages: 0,
    news: 0,
    draftNews: 0,
    media: 0,
    comments: 0,
    services: 0,
    serviceTypes: 0
  });

  const [latestNews, setLatestNews] = useState([]);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {

      setLoading(true);

      const statsRes = await axiosInstance.get("/api/stats");

      setStats(statsRes.data);

      const newsRes = await axiosInstance.get("/api/news");

      setLatestNews(newsRes.data.slice(0, 5));

    } catch (err) {

      console.error(err);

    } finally {

      setLoading(false);

    }
  };
  return (
  <div className="dashboard-container">

    <div className="dashboard-header">

      <div>
        <h2>{t("dashboard")}</h2>
        <p>{t("overview")}</p>
      </div>

    </div>

    <div className="stats-grid">

      <div className="stat-card">
        <div className="stat-icon citizens">
          <FaUsers />
        </div>

        <div className="stat-info">
          <h3>{stats.citizens}</h3>
          <span>{t("totalCitizens")}</span>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon martyrs">
          <FaMedal />
        </div>

        <div className="stat-info">
          <h3>{stats.martyrs}</h3>
          <span>{t("totalMartyrs")}</span>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon special">
          <FaWheelchair />
        </div>

        <div className="stat-info">
          <h3>{stats.specialNeeds}</h3>
          <span>{t("specialNeeds")}</span>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon news">
          <FaNewspaper />
        </div>

        <div className="stat-info">
          <h3>{stats.news}</h3>
          <span>{t("totalNews")}</span>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon media">
          <FaImages />
        </div>

        <div className="stat-info">
          <h3>{stats.media}</h3>
          <span>{t("mediaFiles")}</span>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon comments">
          <FaComments />
        </div>

        <div className="stat-info">
          <h3>{stats.comments}</h3>
          <span>{t("totalComments")}</span>
        </div>
      </div>
      <div className="stat-card">
        <div className="stat-icon services">
          <FaTools />
        </div>

        <div className="stat-info">
          <h3>{stats.services}</h3>
          <span>{t("totalServices")}</span>
        </div>
      </div>


      <div className="stat-card">
        <div className="stat-icon service-types">
          <FaList />
        </div>

        <div className="stat-info">
          <h3>{stats.serviceTypes}</h3>
          <span>{t("serviceTypes")}</span>
        </div>
      </div>


      <div className="stat-card">
        <div className="stat-icon villages">
          <FaBuilding />
        </div>

        <div className="stat-info">
          <h3>{stats.villages}</h3>
          <span>{t("villages")}</span>
        </div>
      </div>


      <div className="stat-card">
        <div className="stat-icon drafts">
          <FaRegFileAlt />
        </div>

        <div className="stat-info">
          <h3>{stats.draftNews}</h3>
          <span>{t("draftNews")}</span>
        </div>
      </div>


    </div>


    {/* ==========================
        Latest News
    =========================== */}

    <div className="latest-section">

      <div className="section-header">

        <h3>
          {t("latestNews")}
        </h3>

      </div>


      {latestNews.length === 0 ? (

        <div className="empty-box">
          {t("noData")}
        </div>

      ) : (

        <div className="news-list">

          {latestNews.map((item) => (

            <div 
              key={item.id}
              className="news-item"
            >

              <div>
                <h4>
                  {item.title}
                </h4>

                <p>
                  {item.content?.slice(0,120)}
                  ...
                </p>
              </div>


              <span>
                {new Date(
                  item.createdAt
                ).toLocaleDateString()}
              </span>


            </div>

          ))}

        </div>

      )}

    </div>
    </div>
  );
};

export default Dashboard;