
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import { useTranslation } from "react-i18next";

import {
  FaArrowRight,
  FaUsers,
  FaMapMarkedAlt,
  FaBuilding,
  FaFileAlt,
  FaImages,
  FaNewspaper
} from "react-icons/fa";

import { API_URL } from "../config/api";

import "./VillageDetails.css";

const VillageDetails = () => {

  const { id } = useParams();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const isArabic = i18n.language === "ar";

  const [village, setVillage] = useState(null);
  const [loading, setLoading] = useState(true);


  useEffect(() => {

    fetchVillage();

  }, [id]);


  const fetchVillage = async () => {

    try {

      setLoading(true);

      const res = await axiosInstance.get(
        `/api/villages/${id}`
      );

      setVillage(res.data);

    } catch (err) {

      console.error("Error fetching village:", err);

    } finally {

      setLoading(false);

    }

  };


  const getMediaUrl = (url) => {

    if (!url) return "";

    if (
      url.startsWith("http://") ||
      url.startsWith("https://")
    ) {
      return url;
    }

    return `${API_URL}/${url.replace(/^\/+/, "")}`;

  };


  const isVideo = (url) => {

    if (!url) return false;

    const cleanUrl = url.split("?")[0].toLowerCase();

    return (
      cleanUrl.endsWith(".mp4") ||
      cleanUrl.endsWith(".webm") ||
      cleanUrl.endsWith(".ogg")
    );

  };


  const isDocument = (url) => {

    if (!url) return false;

    const cleanUrl = url.split("?")[0].toLowerCase();

    return (
      cleanUrl.endsWith(".pdf") ||
      cleanUrl.endsWith(".doc") ||
      cleanUrl.endsWith(".docx")
    );

  };


  const getVillageName = () => {

    if (isArabic) {

      return (
        village.name_ar ||
        village.name ||
        village.name_en ||
        t("Village")
      );

    }

    return (
      village.name_en ||
      village.name ||
      village.name_ar ||
      t("Village")
    );

  };


  const getVillageDescription = () => {

    if (isArabic) {

      return (
        village.description_ar ||
        village.description ||
        village.description_en ||
        t("No description")
      );

    }

    return (
      village.description_en ||
      village.description ||
      village.description_ar ||
      t("No description")
    );

  };


  const getTownName = () => {

    if (!village.town) return "-";

    if (isArabic) {

      return (
        village.town.name_ar ||
        village.town.name ||
        village.town.name_en ||
        "-"
      );

    }

    return (
      village.town.name_en ||
      village.town.name ||
      village.town.name_ar ||
      "-"
    );

  };


  const getNewsDate = (date) => {

    if (!date) return "";

    return new Date(date).toLocaleDateString(
      isArabic ? "ar" : "en",
      {
        year: "numeric",
        month: "long",
        day: "numeric"
      }
    );

  };


  if (loading) {

    return (

      <div className="village-details-loading">

        {t("loading")}

      </div>

    );

  }


  if (!village) {

    return (

      <div className="village-details-loading">

        {t("Village not found")}

      </div>

    );

  }


  const villageNews = village.news || [];


  return (

    <div className="village-details-page">


      {/* Back */}

      <button

        className="village-back-btn"

        onClick={() => navigate(-1)}

      >

        <FaArrowRight />

        {t("Back")}

      </button>



      {/* Village Main Card */}

      <div className="village-details-card">


        {/* Media */}

        <div className="village-main-media">

          {village.media_url ? (

            isVideo(village.media_url) ? (

              <video controls>

                <source
                  src={getMediaUrl(village.media_url)}
                />

                {t("Your browser does not support video")}

              </video>

            ) : isDocument(village.media_url) ? (

              <div className="document-box">

                <FaFileAlt />

                <a

                  href={getMediaUrl(village.media_url)}

                  target="_blank"

                  rel="noreferrer"

                >

                  {t("Open Document")}

                </a>

              </div>

            ) : (

              <img

                src={getMediaUrl(village.media_url)}

                alt={getVillageName()}

              />

            )

          ) : (

            <div className="no-village-media">

              <FaImages />

              <p>
                {t("No Media Available")}
              </p>

            </div>

          )}

        </div>



        {/* Village Information */}

        <div className="village-details-content">


          <h1>

            {getVillageName()}

          </h1>


          <div className="details-divider"></div>



          {village.town && (

            <div className="details-info">

              <FaBuilding />

              <span>

                {getTownName()}

              </span>

            </div>

          )}



          <p className="details-description">

            {getVillageDescription()}

          </p>



          {/* Statistics */}

          <div className="details-stat-grid">


            {village.population && (

              <div className="details-stat-card">

                <FaUsers />

                <div>

                  <strong>

                    {Number(
                      village.population
                    ).toLocaleString(
                      isArabic ? "ar" : "en"
                    )}

                  </strong>

                  <span>

                    {t("Population")}

                  </span>

                </div>

              </div>

            )}



            {village.area && (

              <div className="details-stat-card">

                <FaMapMarkedAlt />

                <div>

                  <strong>

                    {village.area} {t("squareKilometer")}

                  </strong>

                  <span>

                    {t("Area")}

                  </span>

                </div>

              </div>

            )}

          </div>


        </div>

      </div>



      {/* =========================
          Village News
      ========================= */}

      <div className="village-news-section">


        <div className="village-news-header">

          <div>

            <h2>

              <FaNewspaper />

              {t("Village News")}

            </h2>

          </div>

        </div>



        {villageNews.length > 0 ? (

          <div className="village-news-grid">

            {villageNews.map((news) => (

              <article

                className="village-news-card"

                key={news.id}

              >

                <div className="village-news-card-content">


                  <h3>

                    {news.title}

                  </h3>


                  {news.published_at && (

                    <div className="village-news-date">

                      {getNewsDate(
                        news.published_at
                      )}

                    </div>

                  )}


                  {news.category && (

                    <div className="village-news-category">

                      {news.category}

                    </div>

                  )}


                  <p>

                    {news.content}

                  </p>


                  <button

                    className="village-news-read-btn"

                    onClick={() =>
                      navigate(`/news/${news.id}`)
                    }

                  >

                    {t("readMore")}

                    <FaArrowRight />

                  </button>


                </div>

              </article>

            ))}

          </div>

        ) : (

          <div className="news-placeholder">

            <FaNewspaper />

            <p>

              {t("No village news")}

            </p>

          </div>

        )}

      </div>


    </div>

  );

};


export default VillageDetails;