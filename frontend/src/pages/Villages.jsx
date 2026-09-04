import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import { useTranslation } from "react-i18next";

import {
  FaArrowLeft,
  FaArrowRight,
  FaUsers,
  FaMapMarkedAlt,
  FaBuilding,
  FaPlayCircle
} from "react-icons/fa";

import { API_URL } from "../config/api";

import "./Villages.css";


const Villages = () => {
  const { id } = useParams();
  const { t, i18n } = useTranslation();

  const isArabic = i18n.language === "ar";
  const navigate = useNavigate();


  const [villages, setVillages] = useState([]);
  const [loading, setLoading] = useState(true);



  useEffect(() => {

    fetchVillages();

  }, []);



  const fetchVillages = async () => {

    try {

      const res = await axiosInstance.get("/api/villages");

      setVillages(res.data);


    } catch (error) {

      console.log(error);

    } finally {

      setLoading(false);

    }

  };



  const isVideo = (url) => {

    if (!url) return false;

    return (
      url.endsWith(".mp4") ||
      url.endsWith(".webm")
    );

  };



  if (loading) {

    return (

      <div className="villages-loading">

        {t("loading")}

      </div>

    );

  }



  return (

    <div className="villages-page">


      {/* Header */}

      <div className="villages-header">


        <h1>
          {t("villages")}
        </h1>


        <p>
          {t("exploreVillagesDescription")}
        </p>


      </div>




      {/* Empty */}

      {
        villages.length === 0 &&

        <div className="empty-villages">

          <h3>
            {t("noVillagesAvailable")}
          </h3>

        </div>

      }




      {/* Cards */}

      <div className="villages-grid">


        {
          villages.map((village) => (


            <div
              className="village-card"
              key={village.id}
            >



              {/* Media */}

              <div className="village-media">


                {
                  village.media_url ?

                  (

                    isVideo(village.media_url)

                    ?

                    <>

                      <video
                        controls
                        className="village-video"
                      >

                        <source
                          src={`${API_URL}/${village.media_url}`}
                        />

                      </video>


                      <FaPlayCircle className="video-icon"/>


                    </>


                    :

                    <img

                      src={`${API_URL}/${village.media_url}`}

                      alt={
                        isArabic
                          ? (
                              village.name_ar ||
                              village.name ||
                              village.name_en ||
                              "Village"
                            )
                          : (
                              village.name_en ||
                              village.name ||
                              village.name_ar ||
                              "Village"
                            )
                      }

                    />

                  )


                  :

                  (

                    <div className="no-media">

                      {t("noImage")}

                    </div>

                  )

                }



              </div>





              {/* Content */}


              <div className="village-content">


                <h2>

                  {
                    isArabic
                      ? (
                          village.name_ar ||
                          village.name ||
                          village.name_en
                        )
                      : (
                          village.name_en ||
                          village.name ||
                          village.name_ar
                        )
                  }

                </h2>


                <div className="divider"></div>



                {

                  village.town &&

                  <div className="village-info">

                    <FaBuilding/>

                    <span>

                      {
                        isArabic
                          ? (
                              village.town.name_ar ||
                              village.town.name ||
                              village.town.name_en
                            )
                          : (
                              village.town.name_en ||
                              village.town.name ||
                              village.town.name_ar
                            )
                      }

                    </span>

                  </div>

                }





                <p className="village-description">

                  {
                    isArabic
                      ? (
                          village.description_ar ||
                          village.description ||
                          village.description_en ||
                          t("noDescription")
                        )
                      : (
                          village.description_en ||
                          village.description ||
                          village.description_ar ||
                          t("noDescription")
                        )
                  }

                </p>





                <div className="village-stat">


                  {
                    village.population &&

                    <div>

                      <FaUsers/>

                      <span>

                        {village.population}

                      </span>

                    </div>

                  }



                  {
                    village.area &&

                    <div>

                      <FaMapMarkedAlt/>

                      <span>

                        {village.area} km²

                      </span>

                    </div>

                  }



                </div>





                {/* فقط الزر clickable */}

                <button

                  className="village-details-btn"

                  onClick={() =>
                    navigate(`/villages/${village.id}`)
                  }

                >

                  {t("viewDetails")}

                  {isArabic
                    ? <FaArrowLeft />
                    : <FaArrowRight />
                  }

                </button>




              </div>



            </div>


          ))

        }


      </div>



    </div>

  );

};



export default Villages;