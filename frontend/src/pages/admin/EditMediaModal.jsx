import React, { useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import { useTranslation } from "react-i18next";
import { showAppModal } from "../../utils/modal";

const EditMediaModal = ({
  media,
  onClose,
  onSuccess,
}) => {

  const { t } = useTranslation();

  const [title, setTitle] = useState(
    media.title || ""
  );

  const [description, setDescription] = useState(
    media.description || ""
  );

  const [status, setStatus] = useState(
    media.status || "active"
  );

  const [loading, setLoading] = useState(false);

  // ==========================
  // Save Changes
  // ==========================

  const saveChanges = async () => {

    try {

      setLoading(true);

      await axiosInstance.put(
        `/api/medias/${media.id}`,
        {
          title,
          description,
          status,
        }
      );

      onSuccess();

    } catch (err) {

      console.error(err);

      showAppModal(t("saveFailed"), { type: "error" });

    } finally {

      setLoading(false);

    }

  };
  return (

    <div className="modal-overlay">

      <div className="modal-content">

        <h2>{t("Edit Media")}</h2>

        <div className="form-group">

          <label>{t("Title")}</label>

          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

        </div>

        <div className="form-group">

          <label>{t("Description")}</label>

          <textarea
            rows="4"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

        </div>

        <div className="form-group">

          <label>{t("status")}</label>

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >

            <option value="active">
              {t("active")}
            </option>

            <option value="inactive">
              {t("inactive")}
            </option>

          </select>

        </div>

        <div className="modal-actions">

          <button
            className="save-btn"
            onClick={saveChanges}
            disabled={loading}
          >
            {loading
              ? t("saving")
              : t("Save Changes")}
          </button>

          <button
            className="cancel-btn"
            onClick={onClose}
          >
            {t("Cancel")}
          </button>

        </div>

      </div>

    </div>

  );

};

export default EditMediaModal;