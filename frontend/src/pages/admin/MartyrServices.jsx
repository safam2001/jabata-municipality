import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { showAppModal } from "../../utils/modal";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";
import "./AdminRequests.css";

const MartyrServices = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [martyrs, setMartyrs] = useState([]);

  useEffect(() => {
    fetchMartyrs();
  }, []);

  const fetchMartyrs = async () => {
    try {
      const res = await axiosInstance.get("/api/martyrs");

      // فقط الشهداء الموافق عليهم
      // const approved = res.data.filter(
      //   (martyr) => martyr.status === "approved"
      // );

      setMartyrs(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!(await showAppModal(t("areYouSure"), { type: "confirm" }))) return;

    try {
      await axiosInstance.delete(`/api/martyrs/${id}`);
      fetchMartyrs();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="admin-page">

      <div className="page-header">
        <h2>{t("martyrs")}</h2>
      </div>

      <table className="requests-table">

        <thead>
          <tr>
            <th>{t("fullName")}</th>
            <th>{t("nationalId")}</th>
            <th>{t("birthDate")}</th>
            <th>{t("deathDate")}</th>
            <th>{t("phone")}</th>
            <th>{t("address")}</th>
            <th>{t("status")}</th>
            <th>{t("actions")}</th>
          </tr>
        </thead>

        <tbody>

          {martyrs.map((martyr) => (

            <tr key={martyr.id}>

              <td>{martyr.full_name}</td>

              <td>{martyr.national_id}</td>

              <td>
                {martyr.birth_date
                  ? new Date(
                      martyr.birth_date
                    ).toLocaleDateString()
                  : "-"}
              </td>

              <td>
                {martyr.death_date
                  ? new Date(
                      martyr.death_date
                    ).toLocaleDateString()
                  : "-"}
              </td>

              <td>{martyr.phone}</td>

              <td>{martyr.address}</td>

              <td>
                <span className="approved-status">
                  {t("approved")}
                </span>
              </td>

              <td>

                <div className="actions">

                  <button
                    className="details-btn"
                    onClick={() =>
                      navigate(
                        `/admin/person-details/martyr/${martyr.id}`
                      )
                    }
                  >
                    {t("details")}
                  </button>

                  <button
                    className="delete-re-btn"
                    onClick={() =>
                      handleDelete(martyr.id)
                    }
                  >
                    {t("delete")}
                  </button>

                </div>

              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  );
};

export default MartyrServices;