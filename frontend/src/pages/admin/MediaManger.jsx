import React, { useEffect, useMemo, useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import { useTranslation } from "react-i18next";
import { showAppModal } from "../../utils/modal";

import UploadMediaModal from "./UploadMediaModal";
import EditMediaModal from "./EditMediaModal";

import { API_URL } from "../../config/api";

import "./MediaManger.css";

const MediaManager = () => {

  const { t } = useTranslation();

  const [medias, setMedias] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");

  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const [selectedMedia, setSelectedMedia] = useState(null);

  // =========================
  // Load Media
  // =========================

  useEffect(() => {
    fetchMedia();
  }, []);

  const fetchMedia = async () => {
    try {

      setLoading(true);

      const res = await axiosInstance.get("/api/medias");

      setMedias(res.data);

    } catch (err) {

      console.error(err);

    } finally {

      setLoading(false);

    }
  };

  // =========================
  // Delete Media
  // =========================

  const deleteMedia = async (id) => {

    if (!(await showAppModal(t("confirmDelete"), { type: "confirm" }))) {
      return;
    }

    try {

      await axiosInstance.delete(`/api/medias/${id}`);

      setMedias((prev) =>
        prev.filter((item) => item.id !== id)
      );

    } catch (err) {

      console.error(err);

    }
  };

  // =========================
  // Open Edit Modal
  // =========================

  const openEdit = (media) => {

    setSelectedMedia(media);

    setShowEditModal(true);

  };

  // =========================
  // Search & Filter
  // =========================

  const filteredMedia = useMemo(() => {

    return medias.filter((item) => {

      const matchSearch =
        item.title
          ?.toLowerCase()
          .includes(search.toLowerCase());

      const matchType =
        typeFilter === "" ||
        item.type === typeFilter;

      return matchSearch && matchType;

    });

  }, [medias, search, typeFilter]);

  // =========================
  // Statistics
  // =========================

  const stats = useMemo(() => {

    return {

      total: medias.length,

      images: medias.filter(
        (m) => m.type === "image"
      ).length,

      videos: medias.filter(
        (m) => m.type === "video"
      ).length,

      documents: medias.filter(
        (m) => m.type === "document"
      ).length,

    };

  }, [medias]);

  return (

    <div className="media-manager-container">

      {/* Header */}

      <div className="page-header">

        <div>

          <h2>{t("mediaManager")}</h2>

        </div>

        <button
          className="upload-btn"
          onClick={() => setShowUploadModal(true)}
        >
          + {t("uploadMedia")}
        </button>

      </div>

      {/* Statistics */}

      <div className="stats-container">

        <div className="stat-card">

          <h3>{stats.total}</h3>

          <span>{t("totalFiles")}</span>

        </div>

        <div className="stat-card">

          <h3>{stats.images}</h3>

          <span>{t("images")}</span>

        </div>

        <div className="stat-card">

          <h3>{stats.videos}</h3>

          <span>{t("videos")}</span>

        </div>

        <div className="stat-card">

          <h3>{stats.documents}</h3>

          <span>{t("documents")}</span>

        </div>

      </div>

      {/* Toolbar */}

      <div className="toolbar">

        <input
          type="text"
          placeholder={t("search")}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
        >

          <option value="">
            {t("allTypes")}
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

      </div>

      {/* Loading */}

      {loading ? (

        <div className="loading-box">

          {t("loading")}

        </div>

      ) : (

        <div className="media-grid">

          {filteredMedia.map((m) => (

            <div
              key={m.id}
              className="media-card"
            >

              {/* Preview */}

              <div className="media-preview">

                {m.type === "image" ? (

                  <img
                    src={`${API_URL}/${m.file_path}`}
                    alt={m.title}
                  />

                ) : m.type === "video" ? (

                  <video controls>

                    <source
                      src={`${API_URL}/${m.file_path}`}
                    />

                  </video>

                ) : (

                  <div className="document-box">
                    📄
                  </div>

                )}

              </div>

              {/* Info */}

              <div className="media-info">

                <h3>{m.title}</h3>

                <p>
                  {m.description || t("noDescription")}
                </p>

                <div className="info-item">
                  <strong>{t("type")}:</strong>{" "}
                  {m.type}
                </div>

                <div className="info-item">
                  <strong>{t("size")}:</strong>{" "}
                  {m.size} KB
                </div>

                <div className="info-item">
                  <strong>{t("news")}:</strong>{" "}
                  {m.news?.title || "-"}
                </div>

                <div className="info-item">
                  <strong>{t("village")}:</strong>{" "}
                  {m.village?.name || "-"}
                </div>

                <div className="info-item">
                  <strong>{t("uploadedBy")}:</strong>{" "}

                  {m.uploadedBy
                    ? `${m.uploadedBy.firstName} ${m.uploadedBy.lastName}`
                    : "-"
                  }

                </div>

                <div className="info-item">
                  <strong>{t("date")}:</strong>{" "}

                  {new Date(
                    m.createdAt
                  ).toLocaleDateString()}

                </div>

              </div>

              {/* Actions */}

              <div className="media-actions">

                <button
                  className="edit-btn"
                  onClick={() => openEdit(m)}
                >
                  {t("edit")}
                </button>

                <button
                  className="delete-re-btn"
                  onClick={() => deleteMedia(m.id)}
                >
                  {t("delete")}
                </button>

              </div>

            </div>

          ))}

        </div>

      )}

      {/* Upload Modal */}

      {showUploadModal && (

        <UploadMediaModal

          onClose={() =>
            setShowUploadModal(false)
          }

          onSuccess={() => {

            fetchMedia();

            setShowUploadModal(false);

          }}

        />

      )}

      {/* Edit Modal */}

      {showEditModal && selectedMedia && (

        <EditMediaModal

          media={selectedMedia}

          onClose={() =>
            setShowEditModal(false)
          }

          onSuccess={() => {

            fetchMedia();

            setShowEditModal(false);

          }}

        />

      )}

    </div>

  );

};

export default MediaManager;