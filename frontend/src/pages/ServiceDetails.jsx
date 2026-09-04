import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import { useTranslation } from "react-i18next";
import {
  FaPaperPlane,
  FaArrowLeft,
  FaClipboardList,
  FaMoneyBillWave,
  FaLink,
  FaArrowRight
} from "react-icons/fa";
import "./ServiceDetails.css";

import "react-international-phone/style.css";
import { isValidPhoneNumber } from "libphonenumber-js";
import RequestForm from "../components/RequestForm";

const ServiceDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const isArabic = i18n.language === "ar";

  const [serviceType, setServiceType] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const [message, setMessage] = useState({
    type: "",
    text: ""
  });

 const initialFormState = {
  full_name: "",
  national_id: "",
  birth_date: "",
  death_date: "",
  disability_type: "",
  other_disability: "",
  address: "",
  phone: "",
  notes: "",
  files: []
};
  const [formData, setFormData] = useState(initialFormState);

  // =========================
  // Fetch Service
  // =========================

  useEffect(() => {
    fetchServiceType();
  }, [id]);

  const fetchServiceType = async () => {
    try {
      const res = await axiosInstance.get(
        `/api/service-types/public/${id}`
      );

      setServiceType(res.data);

    } catch (err) {
      console.error(
        "Error fetching service type:",
        err
      );
    }
  };

  // =========================
  // Detect Form Type
  // =========================

  const detectFormType = () => {
    if (!serviceType) return null;

    return serviceType.person_type || "general";
  };

  // =========================
  // Handle Input Change
  // =========================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: ""
    }));
  };

  // =========================
  // Handle Files
  // =========================

  const handleFile = (e) => {
    const files = Array.from(e.target.files);

    const maxSize = 10 * 1024 * 1024;

    const invalid = files.find(
      (file) => file.size > maxSize
    );

    if (invalid) {
      setMessage({
        type: "error",
        text: t("validation.fileTooLarge")
      });

      return;
    }

    setFormData((prev) => ({
      ...prev,
      files
    }));
  };

  // =========================
  // Open Request Form
  // =========================

  const openRequest = () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setMessage({
        type: "error",
        text: t("pleaseLoginFirst")
      });

      navigate("/login");

      return;
    }

    setShowForm(true);
  };

  // =========================
  // Reset Form
  // =========================

  const resetFormState = () => {
    setErrors({});
    setFormData(initialFormState);
    setShowForm(false);
  };

  // =========================
  // Validate Form
  // =========================

  const validateForm = () => {
    let newErrors = {};

    const type = detectFormType();

    // Full Name
    if (!formData.full_name?.trim()) {
      newErrors.full_name =
        t("validation.fullNameRequired");

    } else if (
      formData.full_name
        .trim()
        .split(/\s+/)
        .length < 2
    ) {
      newErrors.full_name =
        t("validation.fullNameTwoWords");
    }

    // National ID
    if (!formData.national_id?.trim()) {
      newErrors.national_id =
        t("validation.nationalIdRequired");

    } else if (
      !/^[0-9]{8,20}$/.test(
        formData.national_id
      )
    ) {
      newErrors.national_id =
        t("validation.invalidNationalId");
    }

    // Birth Date
    if (!formData.birth_date) {
      newErrors.birth_date =
        t("validation.birthDateRequired");
    }

    // Address
    if (!formData.address?.trim()) {
      newErrors.address =
        t("validation.addressRequired");
    }

    // Phone
    if (!formData.phone) {
      newErrors.phone =
        t("validation.phoneRequired");

    } else if (
      !isValidPhoneNumber(formData.phone)
    ) {
      newErrors.phone =
        t("validation.invalidPhone");
    }

    // Martyr
    if (
      type === "martyr" &&
      !formData.death_date
    ) {
      newErrors.death_date =
        t("validation.deathDateRequired");
    }

    // Special Needs
    if (
      type === "specialNeeds" &&
      !formData.disability_type?.trim()
    ) {
      newErrors.disability_type =
        t("validation.disabilityTypeRequired");
    }

    setErrors(newErrors);

    return (
      Object.keys(newErrors).length === 0
    );
  };

  // =========================
  // Submit Request
  // =========================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    if (!validateForm()) return;

    setLoading(true);

    setMessage({
      type: "",
      text: ""
    });

    try {
      const data = new FormData();

      data.append(
        "service_id",
        serviceType.service_id
      );

      data.append(
        "service_type_id",
        serviceType.id
      );

      const type = detectFormType();

      data.append("type", type);

      Object.keys(formData).forEach((key) => {
        if (key !== "files") {

          if (key === "phone") {

            data.append(
              "phone",
              formData.phone.replace(/\s/g, "")
            );

          } else {

            data.append(
              key,
              formData[key] || ""
            );

          }
        }
      });

      // =========================
      // Documents
      // =========================

      if (
        formData.files &&
        formData.files.length > 0
      ) {
        formData.files.forEach((file) => {
          data.append(
            "documents",
            file
          );
        });
      }

      // =========================
      // Authentication
      // =========================

      const token =
        localStorage.getItem("token");

      if (!token) {

        setMessage({
          type: "error",
          text: t("pleaseLoginFirst")
        });

        navigate("/login");

        return;
      }

      // =========================
      // Send Request
      // =========================

      const response =
        await axiosInstance.post(
          "/api/requests",
          data,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

      // =========================
      // Success
      // =========================

      if (
        response.data?.message ===
        "Request created successfully"
      ) {

        setMessage({
          type: "success",
          text: t(
            "requestSubmittedSuccessfully"
          )
        });

        resetFormState();

        setTimeout(() => {
          setMessage({
            type: "",
            text: ""
          });
        }, 5000);

      } else {

        setMessage({
          type: "error",
          text: t(
            "unexpectedResponseFromServer"
          )
        });

      }

    } catch (err) {

      console.error(
        "Submit Request Error:",
        err
      );

      const msg =
        err.response?.data?.message;

      // =========================
      // Validation Errors
      // =========================

      if (
        msg ===
        "validation.fullNameTwoWords"
      ) {

        setErrors((prev) => ({
          ...prev,
          full_name:
            t(
              "validation.fullNameTwoWords"
            )
        }));

      } else if (
        msg ===
        "validation.invalidPhone"
      ) {

        setErrors((prev) => ({
          ...prev,
          phone:
            t(
              "validation.invalidPhone"
            )
        }));

      } else if (
        msg ===
        "validation.invalidNationalId"
      ) {

        setErrors((prev) => ({
          ...prev,
          national_id:
            t(
              "validation.invalidNationalId"
            )
        }));

      } else {

        setMessage({
          type: "error",
          text: msg
            ? t(msg)
            : t("somethingWentWrong")
        });

      }

    } finally {

      setLoading(false);

    }
  };

  // =========================
  // Loading
  // =========================

  if (!serviceType) {

    return (
      <div className="loading-page">
        {t("loading")}
      </div>
    );

  }

  return (

    <div className="sdt-page">

      {/* =========================
          Back Button
      ========================= */}

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


      {/* =========================
          Message
      ========================= */}

      {message.text && (

        <div
          className={`request-message ${
            message.type === "success"
              ? "request-success"
              : "request-error"
          }`}
        >

          <div className="request-message-icon">

            {message.type === "success"
              ? "✓"
              : "!"
            }

          </div>


          <div className="request-message-content">

            <h4>

              {message.type === "success"
                ? t("success")
                : t("error")
              }

            </h4>

            <p>
              {message.text}
            </p>

          </div>

        </div>

      )}


      {/* =========================
          Service Card
      ========================= */}

      <div className="sdt-service-card">

        <h2 className="sdt-title">
          {serviceType.title}
        </h2>


        <p className="sdt-description">
          {serviceType.description}
        </p>


        {/* =========================
            Service Information
        ========================= */}

        <div className="sdt-info-grid">

          {/* Requirements */}

          <div className="sdt-info-card">

            <FaClipboardList />

            <div>

              <h4>
                {t("requirements")}
              </h4>

              <p>
                {serviceType.requirements ||
                  t("noRequirements")
                }
              </p>

            </div>

          </div>


          {/* Fees */}

          <div className="sdt-info-card">

            <FaMoneyBillWave />

            <div>

              <h4>
                {t("fees")}
              </h4>

              <p>
                {serviceType.fee || 0} ل.س
              </p>

            </div>

          </div>


          {/* Service Link */}

          {serviceType.link && (

            <div className="sdt-info-card">

              <FaLink />

              <div>

                <h4>
                  {t("serviceLink")}
                </h4>

                <a
                  href={serviceType.link}
                  target="_blank"
                  rel="noreferrer"
                >
                  {serviceType.link}
                </a>

              </div>

            </div>

          )}

        </div>


        {/* =========================
            Request Button
        ========================= */}

        {!showForm && (

          <button
            className="sdt-request-btn"
            onClick={openRequest}
          >

            <FaPaperPlane />

            {t("submitRequest")}

          </button>

        )}


        {/* =========================
            Request Form
        ========================= */}

        {showForm && (

          <form
            className="sdt-request-form"
            onSubmit={handleSubmit}
          >

            <h3 className="sdt-form-title">
              {t("submitRequest")}
            </h3>


            <RequestForm
              type={detectFormType()}
              formData={formData}
              errors={errors}
              setErrors={setErrors}
              handleChange={handleChange}
              handleFile={handleFile}
              setFormData={setFormData}
              t={t}
            />


            {/* =========================
                Form Buttons
            ========================= */}

            <div className="form-buttons">

              <button
                type="submit"
                className="sdt-submit-btn"
                disabled={loading}
              >

                <FaPaperPlane />

                {loading
                  ? t("sending")
                  : t("sendRequest")
                }

              </button>


              <button
                type="button"
                className="sdt-cancel-btn"
                onClick={resetFormState}
              >

                <FaArrowLeft />

                {t("cancel")}

              </button>

            </div>

          </form>

        )}

      </div>

    </div>

  );

};

export default ServiceDetails;