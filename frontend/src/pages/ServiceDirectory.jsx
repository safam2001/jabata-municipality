import React, { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "./ServiceDirectory.css";

import {
  FaArrowRight,
  FaArrowLeft,
  FaUsers,
  FaStar,
  FaWheelchair,
  FaBuilding,
  FaTree,
  FaWater,
  FaHome,
  FaCog
} from "react-icons/fa";

const icons = {
  FaUsers,
  FaStar,
  FaWheelchair,
  FaBuilding,
  FaTree,
  FaWater,
  FaHome,
  FaCog
};

const ServiceDirectory = () => {

  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";
  const navigate = useNavigate();

  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {

    try {

      const res = await axiosInstance.get("/api/services");

      setServices(res.data);

    } catch (err) {

      console.log(err);

    } finally {

      setLoading(false);

    }

  };

  if (loading) {

    return (

      <div className="sd-loading">

        <h2>
          {t("loading")}
        </h2>

      </div>

    );

  }

  return (

    <div className="sd-page">

      <div className="sd-header">

        <button
          className="st-back-btn"
          onClick={() => navigate(-1)}
        >

          {isArabic
            ? <FaArrowRight />
            : <FaArrowLeft />
          }

          {t("back")}

        </button>

        <div className="sd-title-box">

          <h1>
            {t("serviceDirectory")}
          </h1>

          <p>
            {t("browseAllMunicipalityServices")}
          </p>

        </div>

      </div>


      <div className="sd-grid">

        {services.map((service) => {

          const Icon = icons[service.icon] || FaCog;

          return (

            <div
              key={service.id}
              className="sd-card"
            >

              <div className="sd-card-left">

                <div className="sd-icon">

                  <Icon />

                </div>

                <div className="sd-content">

                  <h3>
                    {service.title}
                  </h3>

                </div>

              </div>


              <button
                className="sd-arrow-btn"
                onClick={() =>
                  navigate(`/service/${service.id}`)
                }
              >

                {isArabic
                  ? <FaArrowLeft />
                  : <FaArrowRight />
                }

              </button>

            </div>

          );

        })}

      </div>


      <div className="sd-footer">

        <p>
          {t("didntFindTheServiceYouAreLookingFor")}
        </p>

        <button
          className="sd-contact-btn"
          onClick={() => navigate("/contact")}
        >

          {t("contactMunicipality")}

        </button>

      </div>

    </div>

  );

};

export default ServiceDirectory;