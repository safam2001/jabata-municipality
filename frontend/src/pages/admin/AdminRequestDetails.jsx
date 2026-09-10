import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";
import { useTranslation } from "react-i18next";
import { showAppModal } from "../../utils/modal";
import "./AdminRequestDetails.css";
import { API_URL } from "../../config/api";

const AdminRequestDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);

  // Admin Notes
  const [adminNotes, setAdminNotes] = useState("");
  const [savingNotes, setSavingNotes] = useState(false);

  // =====================================
  // Fetch Request
  // =====================================

  useEffect(() => {
    fetchRequest();
  }, [id]);

  const fetchRequest = async () => {
    try {
      const res = await axiosInstance.get(`/api/requests/${id}`);

      setRequest(res.data);
      setAdminNotes(res.data.admin_notes || "");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // =====================================
  // Save Admin Notes
  // =====================================

  const handleSaveNotes = async () => {
    try {
      setSavingNotes(true);

      await axiosInstance.put(`/api/requests/${id}/status`, {
        status: request.status,
        admin_notes: adminNotes,
      });

      setRequest((prev) => ({
        ...prev,
        admin_notes: adminNotes,
      }));

      showAppModal(t("notesSavedSuccessfully"));
    } catch (err) {
      console.error("Save admin notes error:", err);

      showAppModal(
        err.response?.data?.message ||
          t("failedToSaveNotes"),
        { type: "error" }
      );
    } finally {
      setSavingNotes(false);
    }
  };

  // =====================================
  // Loading
  // =====================================

  if (loading) {
    return <h3>{t("loading")}</h3>;
  }

  // =====================================
  // Not Found
  // =====================================

  if (!request) {
    return <h3>{t("requestNotFound")}</h3>;
  }

  // =====================================
  // UI
  // =====================================

  return (
    <div className="admin-request-details">

      {/* Header */}

      <div className="header">

        <h2>{t("requestDetails")}</h2>

        <button
          className="back-btn-req"
          onClick={() => navigate("/admin/requests")}
        >
          {t("back")}
        </button>

      </div>

      {/* Details Card */}

      <div className="details-card">

        {/* Full Name */}

        <div className="row">
          <span>{t("fullName")}</span>
          <p>{request.full_name}</p>
        </div>

        {/* National ID */}

        <div className="row">
          <span>{t("nationalId")}</span>
          <p>{request.national_id}</p>
        </div>

        {/* Phone */}

        <div className="row">
          <span>{t("phone")}</span>
          <p>{request.phone}</p>
        </div>

        {/* Address */}

        <div className="row">
          <span>{t("address")}</span>
          <p>{request.address}</p>
        </div>

        {/* Service */}

        <div className="row">
          <span>{t("service")}</span>
          <p>
            {request.Service?.title || "-"}
          </p>
        </div>

        {/* Service Type */}

        <div className="row">
          <span>{t("serviceType")}</span>
          <p>
            {request.ServiceType?.title || "-"}
          </p>
        </div>

        {/* Status */}

        <div className="row">
          <span>{t("status")}</span>
          <p>{t(request.status)}</p>
        </div>

        {/* User Notes */}

        <div className="row">
          <span>{t("notes")}</span>
          <p>{request.notes || "-"}</p>
        </div>

        {/* =====================================
            Admin Notes
        ===================================== */}

        <div className="admin-notes-section">

          <div className="admin-notes-header">
            <span>{t("adminNotes")}</span>
          </div>

          <textarea
            value={adminNotes}
            onChange={(e) =>
              setAdminNotes(e.target.value)
            }
            placeholder={t("writeAdminNotes")}
            rows={7}
          />

          <button
            className="save-admin-notes-btn"
            onClick={handleSaveNotes}
            disabled={savingNotes}
          >
            {savingNotes
              ? t("saving")
              : t("saveNotes")}
          </button>

        </div>

        {/* =====================================
            Documents
        ===================================== */}

        <div className="row documents">

          <span>{t("documents")}</span>

          <div className="documents-list">

            {request.documents?.length > 0 ? (

              request.documents.map((doc, index) => {

                const filePath = doc.path
                  ?.replace(/\\/g, "/")
                  .replace(/^uploads\//, "");

                const fileUrl =
                  `${API_URL}/uploads/${filePath}`;

                return (

                  <div
                    key={index}
                    className="document-card"
                  >

                    <img
                      src={fileUrl}
                      alt={
                        doc.originalname ||
                        t("document")
                      }
                      className="document-image"
                    />

                    <a
                      href={fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {t("open")}
                    </a>

                  </div>

                );

              })

            ) : (

              <p>{t("noDocuments")}</p>

            )}

          </div>

        </div>

      </div>

    </div>
  );
};

export default AdminRequestDetails;