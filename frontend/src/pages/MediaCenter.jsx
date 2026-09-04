import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import {
  FaImages,
  FaImage,
  FaVideo,
  FaFileAlt,
  FaSearch,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaTimes,
  FaChevronLeft,
  FaChevronRight,
  FaDownload,
  FaPlay,
  FaExternalLinkAlt
} from "react-icons/fa";

import axiosInstance from "../api/axiosInstance";

import { API_URL } from "../config/api";
import "./MediaCenter.css";

const MediaCenter = () => {
  const { t } = useTranslation();

  const [media, setMedia] = useState([]);
  const [villages, setVillages] = useState([]);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [type, setType] = useState("all");
  const [villageId, setVillageId] = useState("all");

  const [selectedMedia, setSelectedMedia] = useState(null);

  // =========================
  // جلب الوسائط
  // =========================

  useEffect(() => {
    fetchMedia();
    fetchVillages();
  }, []);

  const fetchMedia = async () => {
    try {
      const res = await axiosInstance.get("/api/medias");

      setMedia(res.data);
    } catch (err) {
      console.error("Media Error:", err);
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // جلب القرى
  // =========================

  const fetchVillages = async () => {
    try {
      const res = await axiosInstance.get("/api/villages");

      setVillages(res.data);
    } catch (err) {
      console.error("Villages Error:", err);
    }
  };

  // =========================
  // URL الملف
  // =========================

  const getMediaUrl = (item) => {
    if (!item?.file_path) return "";

    return `${API_URL}/${item.file_path}`;
  };

  // =========================
  // فلترة الوسائط
  // =========================

  const filteredMedia = useMemo(() => {
    return media.filter((item) => {

      // النوع
      const matchesType =
        type === "all" ||
        item.type === type;

      // القرية
      const matchesVillage =
        villageId === "all" ||
        String(item.village_id) === String(villageId);

      // البحث
      const searchValue = search.trim().toLowerCase();

      const matchesSearch =
        !searchValue ||
        item.title?.toLowerCase().includes(searchValue) ||
        item.description?.toLowerCase().includes(searchValue) ||
        item.news?.title?.toLowerCase().includes(searchValue);

      return (
        matchesType &&
        matchesVillage &&
        matchesSearch
      );
    });
  }, [media, type, villageId, search]);

  // =========================
  // فتح الوسيط
  // =========================

  const openMedia = (item) => {
    setSelectedMedia(item);
  };

  // =========================
  // إغلاق
  // =========================

  const closeMedia = () => {
    setSelectedMedia(null);
  };

  // =========================
  // الصورة التالية
  // =========================

  const nextMedia = () => {

    if (!selectedMedia) return;

    const currentIndex =
      filteredMedia.findIndex(
        (item) => item.id === selectedMedia.id
      );

    const nextIndex =
      (currentIndex + 1) %
      filteredMedia.length;

    setSelectedMedia(
      filteredMedia[nextIndex]
    );
  };

  // =========================
  // الصورة السابقة
  // =========================

  const previousMedia = () => {

    if (!selectedMedia) return;

    const currentIndex =
      filteredMedia.findIndex(
        (item) => item.id === selectedMedia.id
      );

    const previousIndex =
      (currentIndex - 1 + filteredMedia.length) %
      filteredMedia.length;

    setSelectedMedia(
      filteredMedia[previousIndex]
    );
  };

  // =========================
  // نوع الوسيط
  // =========================

  const getTypeLabel = (type) => {

    if (type === "image") {
      return t("images");
    }

    if (type === "video") {
      return t("videos");
    }

    if (type === "document") {
      return t("documents");
    }

    return type;
  };

  // =========================
  // أيقونة النوع
  // =========================

  const getTypeIcon = (type) => {

    if (type === "image") {
      return <FaImage />;
    }

    if (type === "video") {
      return <FaVideo />;
    }

    return <FaFileAlt />;
  };

  // =========================
  // إحصائيات
  // =========================

  const imageCount =
    media.filter(
      (item) => item.type === "image"
    ).length;

  const videoCount =
    media.filter(
      (item) => item.type === "video"
    ).length;

  const documentCount =
    media.filter(
      (item) => item.type === "document"
    ).length;

  // =========================
  // Loading
  // =========================

  if (loading) {
    return (
      <div className="media-loading">
        <FaImages />

        <p>
          {t("loading")}
        </p>
      </div>
    );
  }

  return (
    <div className="media-center-page">

      {/* ================= HEADER ================= */}

      <div className="media-header">

        <div className="media-header-content">

          <div className="media-header-icon">
            <FaImages />
          </div>

          <div>

            <h1>
              {t("mediaCenter")}
            </h1>

            <p>
              {t(
                "exploreLatestMedia"
              )}
            </p>

          </div>

        </div>

      </div>


      {/* ================= STATISTICS ================= */}

      <div className="media-stats">

        <div
          className={`media-stat ${
            type === "all"
              ? "active"
              : ""
          }`}
          onClick={() => setType("all")}
        >

          <div className="media-stat-icon">
            <FaImages />
          </div>

          <div>
            <strong>
              {media.length}
            </strong>

            <span>
              {t("allMedia")}
            </span>
          </div>

        </div>


        <div
          className={`media-stat ${
            type === "image"
              ? "active"
              : ""
          }`}
          onClick={() => setType("image")}
        >

          <div className="media-stat-icon">
            <FaImage />
          </div>

          <div>
            <strong>
              {imageCount}
            </strong>

            <span>
              {t("images")}
            </span>
          </div>

        </div>


        <div
          className={`media-stat ${
            type === "video"
              ? "active"
              : ""
          }`}
          onClick={() => setType("video")}
        >

          <div className="media-stat-icon">
            <FaVideo />
          </div>

          <div>
            <strong>
              {videoCount}
            </strong>

            <span>
              {t("videos")}
            </span>
          </div>

        </div>


        <div
          className={`media-stat ${
            type === "document"
              ? "active"
              : ""
          }`}
          onClick={() => setType("document")}
        >

          <div className="media-stat-icon">
            <FaFileAlt />
          </div>

          <div>
            <strong>
              {documentCount}
            </strong>

            <span>
              {t("documents")}
            </span>
          </div>

        </div>

      </div>


      {/* ================= FILTERS ================= */}

      <div className="media-filters">

        <div className="media-search">

          <FaSearch />

          <input
            type="text"
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            placeholder={t(
              "searchMedia"
            )}
          />

        </div>


        <select
          value={type}
          onChange={(e) =>
            setType(e.target.value)
          }
        >

          <option value="all">
            {t("allMedia")}
          </option>

          <option value="image">
            {t("images")}
          </option>

          <option value="video">
            {t("videos")}
          </option>

          <option value="document">
            {t("documents")}
          </option>

        </select>


        <select
          value={villageId}
          onChange={(e) =>
            setVillageId(e.target.value)
          }
        >

          <option value="all">
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

      </div>


      {/* ================= RESULTS INFO ================= */}

      <div className="media-results">

        <span>
          {t("showing")}{" "}
          <strong>
            {filteredMedia.length}
          </strong>{" "}
          {t("media")}
        </span>

      </div>


      {/* ================= MEDIA GRID ================= */}

      {filteredMedia.length === 0 ? (

        <div className="media-empty">

          <FaImages />

          <h3>
            {t("noMediaAvailable")}
          </h3>

          <p>
            {t(
              "noMediaMatchesFilters"
            )}
          </p>

        </div>

      ) : (

        <div className="media-grid">

          {filteredMedia.map((item) => (

            <div
              key={item.id}
              className={`media-card media-${item.type}`}
            >

              {/* IMAGE */}

              {item.type === "image" && (

                <div
                  className="media-preview"
                  onClick={() =>
                    openMedia(item)
                  }
                >

                  <img
                    src={getMediaUrl(item)}
                    alt={
                      item.title ||
                      t("mediaFile")
                    }
                  />

                  <div className="media-overlay">

                    <FaImage />

                    <span>
                      {t("viewImage")}
                    </span>

                  </div>

                </div>

              )}


              {/* VIDEO */}

              {item.type === "video" && (

                <div
                  className="media-preview video-preview"
                  onClick={() =>
                    openMedia(item)
                  }
                >

                  <video
                    src={getMediaUrl(item)}
                    muted
                  />

                  <div className="media-play">

                    <FaPlay />

                  </div>

                </div>

              )}


              {/* DOCUMENT */}

              {item.type === "document" && (

                <div className="document-preview">

                  <FaFileAlt />

                  <span>
                    {item.file_name}
                  </span>

                </div>

              )}


              {/* CONTENT */}

              <div className="media-card-content">

                <div className="media-type">

                  {getTypeIcon(item.type)}

                  {getTypeLabel(item.type)}

                </div>


                <h3>
                  {item.title ||
                    item.file_name}
                </h3>


                {item.description && (

                  <p>
                    {item.description}
                  </p>

                )}


                <div className="media-meta">

                  {item.village && (

                    <span>

                      <FaMapMarkerAlt />

                      {item.village.name}

                    </span>

                  )}

                  <span>

                    <FaCalendarAlt />

                    {new Date(
                      item.createdAt
                    ).toLocaleDateString()}

                  </span>

                </div>


                {item.news && (

                  <div className="media-news">

                    {item.news.title}

                  </div>

                )}


                {/* DOCUMENT ACTION */}

                {item.type === "document" && (

                  <a
                    href={getMediaUrl(item)}
                    target="_blank"
                    rel="noreferrer"
                    className="media-open-btn"
                  >

                    <FaExternalLinkAlt />

                    {t("openFile")}

                  </a>

                )}

              </div>

            </div>

          ))}

        </div>

      )}


      {/* ================= MODAL ================= */}

      {selectedMedia && (

        <div
          className="media-modal"
          onClick={closeMedia}
        >

          <button
            className="media-modal-close"
            onClick={closeMedia}
          >
            <FaTimes />
          </button>


          <button
            className="media-modal-prev"
            onClick={(e) => {
              e.stopPropagation();
              previousMedia();
            }}
          >
            <FaChevronLeft />
          </button>


          <div
            className="media-modal-content"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            {selectedMedia.type === "image" && (

              <img
                src={getMediaUrl(
                  selectedMedia
                )}
                alt={
                  selectedMedia.title ||
                  t("mediaFile")
                }
              />

            )}


            {selectedMedia.type === "video" && (

              <video
                src={getMediaUrl(
                  selectedMedia
                )}
                controls
                autoPlay
              />

            )}


            <div className="media-modal-info">

              <span>
                {getTypeIcon(
                  selectedMedia.type
                )}

                {getTypeLabel(
                  selectedMedia.type
                )}
              </span>

              <h3>
                {selectedMedia.title ||
                  selectedMedia.file_name}
              </h3>

              {selectedMedia.description && (

                <p>
                  {selectedMedia.description}
                </p>

              )}

            </div>

          </div>


          <button
            className="media-modal-next"
            onClick={(e) => {
              e.stopPropagation();
              nextMedia();
            }}
          >
            <FaChevronRight />
          </button>

        </div>

      )}

    </div>
  );
};

export default MediaCenter;