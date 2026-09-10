import React, { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import { useTranslation } from "react-i18next";
import { showAppModal } from "../../utils/modal";

const UploadMediaModal = ({ onClose, onSuccess }) => {

  const { t } = useTranslation();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [newsId, setNewsId] = useState("");
  const [villageId, setVillageId] = useState("");

  const [files, setFiles] = useState([]);

  const [news, setNews] = useState([]);
  const [villages, setVillages] = useState([]);

  const [loading, setLoading] = useState(false);

  // ==========================
  // Load News & Villages
  // ==========================

  useEffect(() => {

    loadData();

  }, []);

  const loadData = async () => {

    try {

      const [newsRes, villageRes] = await Promise.all([

        axiosInstance.get("/api/news"),

        axiosInstance.get("/api/villages")

      ]);

      setNews(newsRes.data);

      setVillages(villageRes.data);

    } catch (err) {

      console.error(err);

    }

  };

  // ==========================
  // Files
  // ==========================

  const handleFiles = (e) => {

    setFiles(Array.from(e.target.files));

  };
  // ==========================
  // Upload Media
  // ==========================

  const uploadMedia = async () => {

    if (files.length === 0) {

      showAppModal(t("selectFiles"), { type: "error" });

      return;

    }

    try {

      setLoading(true);

      const formData = new FormData();

      formData.append("title", title);

      formData.append("description", description);

      if (newsId) {

        formData.append("news_id", newsId);

      }

      if (villageId) {

        formData.append("village_id", villageId);

      }

      files.forEach((file) => {

        formData.append("files", file);

      });

      await axiosInstance.post(
        "/api/medias",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      onSuccess();

    } catch (err) {

      console.error(err);

      showAppModal(t("uploadFailed"), { type: "error" });

    } finally {

      setLoading(false);

    }

  };
  return (

    <div className="modal-overlay">

      <div className="modal-content">

        <h2>{t("uploadMedia")}</h2>

        <div className="form-group">

          <label>{t("title")}</label>

          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

        </div>

        <div className="form-group">

          <label>{t("description")}</label>

          <textarea
            rows="4"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

        </div>

        <div className="form-group">

          <label>{t("news")}</label>

          <select
            value={newsId}
            onChange={(e) => setNewsId(e.target.value)}
          >

            <option value="">
              {t("selectNews")}
            </option>

            {news.map((item) => (

              <option
                key={item.id}
                value={item.id}
              >
                {item.title}
              </option>

            ))}

          </select>

        </div>

        <div className="form-group">

          <label>{t("village")}</label>

          <select
            value={villageId}
            onChange={(e) => setVillageId(e.target.value)}
          >

            <option value="">
              {t("selectVillage")}
            </option>

            {villages.map((item) => (

              <option
                key={item.id}
                value={item.id}
              >
                {item.name}
              </option>

            ))}

          </select>

        </div>

        <div className="form-group">

          <label>{t("files")}</label>

          <input
            type="file"
            multiple
            onChange={handleFiles}
          />

        </div>

        <div className="modal-actions">

          <button
            className="save-btn"
            onClick={uploadMedia}
            disabled={loading}
          >
            {loading
              ? t("uploading")
              : t("upload")}
          </button>

          <button
            className="cancel-btn"
            onClick={onClose}
          >
            {t("cancel")}
          </button>

        </div>

      </div>

    </div>

  );

};

export default UploadMediaModal;