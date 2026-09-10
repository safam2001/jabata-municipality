import React, { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { showAppModal } from "../../utils/modal";
import "./AdminRequests.css";

const CitizenServices = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [citizens, setCitizens] = useState([]);

  useEffect(() => {
    fetchCitizens();
  }, []);

  const fetchCitizens = async () => {
    try {
      const res = await axiosInstance.get("/api/citizens");

      // ❌ لا تعمل فلترة لأن جدول Citizen ما فيه status
      setCitizens(res.data);

    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!(await showAppModal(t("Are you sure?"), { type: "confirm" }))) return;

    try {
      await axiosInstance.delete(`/api/citizens/${id}`);
      fetchCitizens();
    } catch (err) {
      console.error(err);
    }
  };
   console.log("row:",citizens);
  return (
    <div className="admin-page">

      <div className="page-header">
        <h2>{t("Citizens")}</h2>
      </div>

      <table className="requests-table">
        <thead>
          <tr>
            <th>{t("Full Name")}</th>
            <th>{t("National ID")}</th>
            <th>{t("Birth Date")}</th>
            <th>{t("Phone")}</th>
            <th>{t("Address")}</th>
            <th>{t("Actions")}</th>
          </tr>
        </thead>

        <tbody>
          {citizens.map((citizen) => (
           
            <tr key={citizen.id}>

              <td>{citizen.full_name}</td>
              <td>{citizen.national_id}</td>

              <td>
                {citizen.birth_date
                  ? new Date(citizen.birth_date).toLocaleDateString()
                  : "-"}
              </td>

              <td>{citizen.phone}</td>
              <td>{citizen.address}</td>

              <td>
                
                <div className="actions">
                  <button
                
                    className="details-btn"
                    onClick={() =>
                      // navigate(`/admin/citizens/${citizen.id}`)
        navigate(`/admin/person-details/citizen/${citizen.id}`)
                    }
                  >
                    {t("details")}
                  </button>

                  <button
                    className="delete-re-btn"
                    onClick={() => handleDelete(citizen.id)}
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

export default CitizenServices;