
import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";

import "swiper/css";
import "swiper/css/pagination";
import "./Home.css";

import { useSiteSettings } from "../context/SiteSettingsContext";

const Home = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const { settings, loading } = useSiteSettings();

  const [showServices, setShowServices] = useState(false);
  const [showVillages, setShowVillages] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");

  const [services, setServices] = useState([]);
  const [villages, setVillages] = useState([]);

  // =========================================
  // CURRENT LANGUAGE
  // =========================================

  const language =
    i18n.resolvedLanguage === "en" ? "en" : "ar";

  // =========================================
  // MULTI LANGUAGE TEXT HELPER
  // =========================================

  const getText = (field, fallback = "") => {
    if (!field) return fallback;

    let value = field;

    // إذا كانت القيمة String وقد تكون JSON
    if (typeof field === "string") {
      try {
        const parsed = JSON.parse(field);

        if (
          parsed &&
          typeof parsed === "object" &&
          !Array.isArray(parsed)
        ) {
          value = parsed;
        } else {
          return field;
        }
      } catch {
        return field;
      }
    }

    // إذا كانت Object
    if (
      typeof value === "object" &&
      value !== null
    ) {
      return (
        value[language] ||
        value.ar ||
        value.en ||
        fallback
      );
    }

    return fallback;
  };

  // =========================================
  // LOAD SERVICES & VILLAGES
  // =========================================

  useEffect(() => {
    axiosInstance
      .get("/api/services")
      .then((res) => {
        setServices(res.data);
      })
      .catch((err) => {
        console.error(
          "Services error:",
          err
        );
      });

    axiosInstance
      .get("/api/villages")
      .then((res) => {
        setVillages(res.data);
      })
      .catch((err) => {
        console.error(
          "Villages error:",
          err
        );
      });
  }, []);

  // =========================================
  // FILTER SERVICES
  // =========================================

  const filteredServices = services.filter(
    (service) =>
      service.title
        ?.toLowerCase()
        .includes(
          searchTerm.toLowerCase()
        )
  );

  // =========================================
  // LANGUAGE DEBUG
  // =========================================

  useEffect(() => {
    console.log(
      "HOME LANGUAGE CHANGED:",
      language
    );
  }, [language]);

  // =========================================
  // HOME
  // =========================================

  return (
    <div className="home-container">

      {/* =====================================
          FULL SCREEN SLIDER
      ===================================== */}

      <section className="hero-slider-full">

        <Swiper
          /*
            مهم جداً:
            عند تغيير اللغة يتم إنشاء Swiper جديد
            حتى لا تبقى الشاشة بيضاء
          */
          key={`home-swiper-${language}`}

          modules={[
            Pagination,
            Autoplay
          ]}

          slidesPerView={1}

          pagination={{
            clickable: true
          }}

          autoplay={{
            delay: 3000
          }}

          loop={true}

          className="mySwiper"
        >

          {/* SLIDE 1 */}

          <SwiperSlide>

            <img
              src="/images/ja.jpeg"
              className="slide-img-full"
              alt="Jabata Al-Khashab"
            />

          </SwiperSlide>


          {/* SLIDE 2 */}

          <SwiperSlide>

            <img
              src="/images/ja.jpeg"
              className="slide-img-full"
              alt="Jabata Al-Khashab"
            />

          </SwiperSlide>


          {/* SLIDE 3 */}

          <SwiperSlide>

            <img
              src="/images/ja1.jpeg"
              className="slide-img-full"
              alt="Jabata Al-Khashab"
            />

          </SwiperSlide>

        </Swiper>


        {/* =================================
            TEXT OVER IMAGE
        ================================= */}

        <div className="hero-text-full">

          <h1>

            {getText(
              settings?.siteName,
              t(
                "Jibatha Al-Khashab Municipality"
              )
            )}

          </h1>


          <p>

            {getText(
              settings?.description,
              t(
                "A leading municipality in services and quality of life"
              )
            )}

          </p>


          {/* =================================
              BUTTONS
          ================================= */}

          <div className="hero-buttons">

            <button
              onClick={() =>
                setShowServices(
                  !showServices
                )
              }
            >

              {t("services")} ▼

            </button>

          </div>

        </div>

      </section>


      {/* =====================================
          SERVICES DROPDOWN
      ===================================== */}

      {showServices && (

        <div className="dropdown-box">

          <button
            className="view-all-btn"
            onClick={() =>
              navigate("/services")
            }
          >

            {t("View all services")}

          </button>

        </div>

      )}


      {/* =====================================
          VILLAGES DROPDOWN
      ===================================== */}

      {showVillages && (

        <div className="dropdown-box">

          {villages.map((village) => (

            <div
              key={village.id}
              className="village-dropdown-item"
              onClick={() =>
                navigate(
                  `/village/${village.id}`
                )
              }
            >

              {getText(
                village.name,
                village.name
              )}

            </div>

          ))}

        </div>

      )}

    </div>
  );
};

export default Home;