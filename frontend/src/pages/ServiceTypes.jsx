import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import { useTranslation } from "react-i18next";
import {
  FaArrowRight,
  FaFileAlt,
  FaIdCard,
  FaUsers,
  FaHome,
  FaFileSignature,
  FaCog,


} from "react-icons/fa";
import "./ServiceTypes.css";

const icons = {
  FaFileAlt,
  FaIdCard,
  FaUsers,
  FaHome,
  FaFileSignature,
  FaCog,
  //   FaArrowLeft,
};
import { FaArrowLeft } from "react-icons/fa";
const ServiceTypes = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t,i18n } = useTranslation();

  const [service, setService] = useState(null);
  const [serviceTypes, setServiceTypes] = useState([]);
  const [loading, setLoading] = useState(true);


const isArabic = i18n.language === "ar";
  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      const [serviceRes, typeRes] = await Promise.all([
        axiosInstance.get(`/api/services/${id}`),
        axiosInstance.get(`/api/service-types/service/${id}`),
      ]);

      setService(serviceRes.data);
      setServiceTypes(typeRes.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-page">
        <h2>{t("Loading...")}</h2>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="loading-page">
        <h2>{t("Service not found")}</h2>
      </div>
    );
  }
  return (
    <>
      {/* 
  <button className="back-btn" onClick={() => navigate(-1)}>
    <FaArrowLeft />  back</button> */}
      <div className="st-page">

<button
  className="st-back-btn"
  onClick={() => navigate(-1)}
>
  {isArabic ? <FaArrowRight /> : <FaArrowLeft />}
  {t("back")}
</button>
     

        <div className="st-header">
          <h2>{service.title}</h2>
          <p>{t("Choose the required service type")}</p>
        </div>

        <div className="st-grid">

          {serviceTypes.length === 0 ? (

            <div className="st-empty">
              <h3>{t("No service types available")}</h3>
            </div>

          ) : (

            serviceTypes.map((type) => {

              const Icon = icons[type.icon] || FaFileAlt;

              return (

                <div
                  className="st-card"
                  key={type.id}
                >

                  <div className="st-icon">
                    <Icon />
                  </div>

                  <div className="st-content">

                    <h3>{type.title}</h3>

                    <p>
                      {type.description
                        ? type.description.substring(0, 120)
                        : t("No description")}
                    </p>

                  </div>
                  <button
                    className="st-details-btn"
                    onClick={() =>
                      navigate(`/service-details/${type.id}`)
                    }
                  >
                    {t("viewDetails")}
                    {isArabic ? <FaArrowLeft /> : <FaArrowRight />}
                  </button>

                </div>

              );

            })

          )}

        </div>

      </div>
    </>
  );
};

export default ServiceTypes;