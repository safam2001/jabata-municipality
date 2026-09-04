import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";
import "./AdminRequests.css";

const SpecialNeedsServices = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [specialNeeds, setSpecialNeeds] = useState([]);

  useEffect(() => {
    fetchSpecialNeeds();
  }, []);

  const fetchSpecialNeeds = async () => {
    try {
      const res = await axiosInstance.get("/api/special-needs");

      // ❌ لا تعمل فلترة لأن جدول SpecialNeeds ما فيه status
      setSpecialNeeds(res.data);

    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm(t("areYouSure"))) return;

    try {
      await axiosInstance.delete(`/api/special-needs/${id}`);
      fetchSpecialNeeds();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="admin-page">

      <div className="page-header">
        <h2>{t("specialNeeds")}</h2>
      </div>

      <table className="requests-table">

        <thead>
          <tr>
            <th>{t("fullName")}</th>
            <th>{t("nationalId")}</th>
            <th>{t("birthDate")}</th>
            <th>{t("disabilityType")}</th>
            <th>{t("phone")}</th>
            <th>{t("address")}</th>
            <th>{t("actions")}</th>
          </tr>
        </thead>

        <tbody>

          {specialNeeds.map((person) => (

            <tr key={person.id}>

              <td>{person.full_name}</td>

              <td>{person.national_id}</td>

              <td>
                {person.birth_date
                  ? new Date(
                      person.birth_date
                    ).toLocaleDateString()
                  : "-"}
              </td>

              <td>{person.disability_type}</td>

              <td>{person.phone}</td>

              <td>{person.address}</td>

              <td>

                <div className="actions">

                  <button
                    className="details-btn"
                    onClick={() =>
                      navigate(
                        `/admin/person-details/special-needs/${person.id}`
                      )
                    }
                  >
                    {t("details")}
                  </button>

                  <button
                    className="delete-re-btn"
                    onClick={() =>
                      handleDelete(person.id)
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

export default SpecialNeedsServices;