import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import axiosInstance from "../../api/axiosInstance";
import { useTranslation } from "react-i18next";
import "./AdminRequestDetails.css";

const AdminPersonDetails = () => {
  const { type, id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDetails();
  }, [type, id]);

  const fetchDetails = async () => {
    try {
      let url = "";

      if (type === "martyr") {
        url = `/api/martyrs/${id}`;
      }

      if (type === "citizen") {
        url = `/api/citizens/${id}`;
      }

      if (type === "special-needs") {
        url = `/api/special-needs/${id}`;
      }

      const res = await axiosInstance.get(url);
      setData(res.data);

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <h3>{t("loading")}</h3>;
  }

  if (!data) {
    return <h3>{t("notFound")}</h3>;
  }

  return (
    <div className="admin-person-details">

      <div className="header">

        <h2>
          {type === "martyr" && t("martyrDetails")}
          {type === "citizen" && t("citizenDetails")}
          {type === "special-needs" && t("specialNeedsDetails")}
        </h2>

        <button
          className="back-btn"
          onClick={() => navigate(-1)}
        >
          {t("back")}
        </button>

      </div>

      <div className="details-card">

        {/* Full Name */}
        <div className="row">
          <span>{t("fullName")}</span>
          <p>{data.full_name}</p>
        </div>

        {/* National ID */}
        <div className="row">
          <span>{t("nationalId")}</span>
          <p>{data.national_id}</p>
        </div>

        {/* Phone */}
        <div className="row">
          <span>{t("phone")}</span>
          <p>{data.phone || "-"}</p>
        </div>

        {/* Address */}
        <div className="row">
          <span>{t("address")}</span>
          <p>{data.address || "-"}</p>
        </div>

        {/* Martyr Details */}
        {type === "martyr" && (
          <>
            <div className="row">

              <span>{t("birthDate")}</span>

              <p>
                {data.birth_date
                  ? new Date(
                      data.birth_date
                    ).toLocaleDateString()
                  : "-"}
              </p>

            </div>

            <div className="row">

              <span>{t("deathDate")}</span>

              <p>
                {data.death_date
                  ? new Date(
                      data.death_date
                    ).toLocaleDateString()
                  : "-"}
              </p>

            </div>
          </>
        )}

        {/* Special Needs Details */}
        {type === "special-needs" && (
          <div className="row">

            <span>{t("disabilityType")}</span>

            <p>
              {data.disability_type || "-"}
            </p>

          </div>
        )}

        {/* Submitted Date */}
        <div className="row">

          <span>{t("submittedDate")}</span>

          <p>
            {data.createdAt
              ? new Date(
                  data.createdAt
                ).toLocaleString()
              : "-"}
          </p>

        </div>

        {/* Status */}
        <div className="row">

          <span>{t("status")}</span>

          <p>
            {data.status || "-"}
          </p>

        </div>

        {/* Notes */}
        <div className="row">

          <span>{t("notes")}</span>

          <p>
            {data.notes || "-"}
          </p>

        </div>

      </div>

    </div>
  );
};

export default AdminPersonDetails;