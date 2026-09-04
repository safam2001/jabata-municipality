import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  FaCalendarAlt,
  FaEye,
  FaMapMarkerAlt,
  FaArrowLeft,
  FaNewspaper,
  FaSearch,
  FaTimes
} from "react-icons/fa";

import axiosInstance from "../api/axiosInstance";
import "./News.css";
import { API_URL } from "../config/api";

const News = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  // =========================
  // الفلاتر
  // =========================
  const [search, setSearch] = useState("");
  const [villageId, setVillageId] = useState("");
  const [villages, setVillages] = useState([]);

  // =========================
  // جلب القرى
  // =========================
  useEffect(() => {
    const fetchVillages = async () => {
      try {
        const res = await axiosInstance.get("/api/villages");
        setVillages(res.data);
      } catch (err) {
        console.error("Villages Error:", err);
      }
    };

    fetchVillages();
  }, []);

  // =========================
  // جلب الأخبار
  // =========================
  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      setLoading(true);

      const res = await axiosInstance.get("/api/news", {
        params: {
          search: search.trim() || undefined,
          village_id: villageId || undefined
        }
      });

      console.log("News:", res.data);

      setNews(res.data);

    } catch (err) {
      console.error("News Error:", err);
      setNews([]);
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // تنفيذ البحث
  // =========================
  const handleSearch = () => {
    fetchNews();
  };

  // =========================
  // مسح الفلاتر
  // =========================
  const clearFilters = () => {
    setSearch("");
    setVillageId("");

    // نجيب كل الأخبار بعد مسح الفلاتر
    fetchAllNews();
  };

  const fetchAllNews = async () => {
    try {
      setLoading(true);

      const res = await axiosInstance.get("/api/news");

      setNews(res.data);

    } catch (err) {
      console.error("News Error:", err);
      setNews([]);
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // صورة الخبر
  // =========================
  const getImage = (item) => {
    if (item.media?.length) {
      const image = item.media.find(
        (m) => m.type === "image"
      );

      if (image) {
        return `${API_URL}/${image.file_path}`;
      }
    }

    return "/images/news-default.jpg";
  };

  // =========================
  // Loading
  // =========================
  if (loading) {
    return (
      <div className="news-loading">
        {t("loading")}
      </div>
    );
  }

  return (
    <div className="news-page">

      {/* =========================
          HEADER
      ========================= */}

      <div className="news-header">

        <div>

          <h1>
            <FaNewspaper />
            {t("latestNews")}
          </h1>

          <p>
            {t("municipalityNewsAndAnnouncements")}
          </p>

        </div>

      </div>


      {/* =========================
          FILTERS
      ========================= */}

      <div className="news-filters">

        {/* البحث */}

        <div className="news-search">

          <FaSearch />

          <input
            type="text"
            placeholder={t("searchNews")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearch();
              }
            }}
          />

        </div>


        {/* القرية */}

        <select
          value={villageId}
          onChange={(e) => setVillageId(e.target.value)}
        >

          <option value="">
            {t("general")}
          </option>

          {villages.map((village) => (

            <option
              key={village.id}
              value={village.id}
            >
              {village.name}
            </option>

          ))}

        </select>


        {/* زر البحث */}

        <button
          className="news-filter-btn"
          onClick={handleSearch}
        >
          <FaSearch />
          {t("search")}
        </button>


        {/* مسح */}

        {(search || villageId) && (

          <button
            className="news-clear-btn"
            onClick={clearFilters}
          >
            <FaTimes />
            {t("clear")}
          </button>

        )}

      </div>


      {/* =========================
          NEWS GRID
      ========================= */}

      <div className="news-grid">

        {news.length === 0 ? (

          <div className="no-news">
            {t("noNewsAvailable")}
          </div>

        ) : (

          news.map((item) => (

            <div
              className="news-card"
              key={item.id}
            >

              <img
                src={getImage(item)}
                alt={item.title}
                className="news-image"
              />

              <div className="news-content">

                <h2>{item.title}</h2>

                <p className="news-text">

                  {item.content?.length > 170
                    ? item.content.substring(0, 170) + "..."
                    : item.content}

                </p>


                <div className="news-info">

                  <span>

                    <FaMapMarkerAlt />

                    {item.village
                      ? item.village.name
                      : t("general")}

                  </span>


                  <span>

                    <FaCalendarAlt />

                    {new Date(
                      item.createdAt
                    ).toLocaleDateString()}

                  </span>


                  <span>

                    <FaEye />

                    {item.views}

                  </span>

                </div>


                <div className="news-source">

                  {item.source_name ||
                    t("municipalityName")}

                </div>


                <button
                  className="news-details-btn"
                  onClick={() =>
                    navigate(`/news/${item.id}`)
                  }
                >

                  {t("viewDetails")}

                  <FaArrowLeft />

                </button>

              </div>

            </div>

          ))

        )}

      </div>

    </div>
  );
};

export default News;