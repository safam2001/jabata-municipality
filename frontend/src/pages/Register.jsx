
import React, { useState } from "react";
import axiosInstance from "../api/axiosInstance";
import { useNavigate, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaUserPlus,
  FaArrowRight
} from "react-icons/fa";

import "./Register.css";

const Register = () => {

  const { t } = useTranslation();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: ""
  });

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [display, setDisplay] = useState("");
  const [messageType, setMessageType] = useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [loading, setLoading] = useState(false);


  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    });

    if (display) {
      setDisplay("");
      setMessageType("");
    }
  };


  const handleSubmit = async (e) => {

    e.preventDefault();

    setDisplay("");
    setMessageType("");


    if (
      !formData.firstName.trim() ||
      !formData.lastName.trim() ||
      !formData.email.trim() ||
      !formData.password.trim()
    ) {

      setDisplay(
        t("Please fill in all required fields")
      );

      setMessageType("error");

      return;
    }


    if (formData.password !== confirmPassword) {

      setDisplay(
        t("Passwords do not match")
      );

      setMessageType("error");

      return;
    }


    setLoading(true);


    try {

      const response =
        await axiosInstance.post(
          "/api/auth/register",
          formData
        );


      if (
        response.data?.token &&
        response.data?.user
      ) {

        setDisplay(
          t("Registration successful! Redirecting to login...")
        );

        setMessageType("success");


        setTimeout(() => {

          navigate("/login");

        }, 1000);

      } else {

        setDisplay(
          t(
            "Invalid response from server. Please try again."
          )
        );

        setMessageType("error");

      }

    } catch (error) {

      console.error(
        "Registration error:",
        error
      );

      const errorMessage =
        error.response?.data?.message ||
        t("Registration failed. Please try again.");

      setDisplay(errorMessage);

      setMessageType("error");

    } finally {

      setLoading(false);

    }
  };


  return (

    <div className="register-page">

      <div className="auth-overlay"></div>


      <div className="register-container">


        {/* INFO */}

        <div className="auth-info">

          <div className="auth-info-icon">
            <FaUserPlus />
          </div>

          <h1>
            {t("Join Our Community")}
          </h1>

          <p>
            {t(
              "Create your account and stay connected with the municipality"
            )}
          </p>

        </div>


        {/* FORM */}

        <form
          className="register-form"
          onSubmit={handleSubmit}
        >

          <div className="auth-form-header">

            <div className="auth-mobile-icon">
              <FaUserPlus />
            </div>

            <h2>
              {t("register")}
            </h2>

            <p>
              {t("Create a new account")}
            </p>

          </div>


          {/* FIRST + LAST NAME */}

          <div className="register-name-row">


            <div className="auth-input-group">

              <label htmlFor="firstName">
                {t("First Name")}
              </label>

              <div className="auth-input-wrapper">

                <FaUser className="auth-input-icon" />

                <input
                  type="text"
                  id="firstName"
                  placeholder={t("Enter your first name")}
                  value={formData.firstName}
                  onChange={handleChange}
                  autoComplete="given-name"
                  required
                />

              </div>

            </div>


            <div className="auth-input-group">

              <label htmlFor="lastName">
                {t("Last Name")}
              </label>

              <div className="auth-input-wrapper">

                <FaUser className="auth-input-icon" />

                <input
                  type="text"
                  id="lastName"
                  placeholder={t("Enter your last name")}
                  value={formData.lastName}
                  onChange={handleChange}
                  autoComplete="family-name"
                  required
                />

              </div>

            </div>

          </div>


          {/* EMAIL */}

          <div className="auth-input-group">

            <label htmlFor="email">
              {t("Email")}
            </label>

            <div className="auth-input-wrapper">

              <FaEnvelope className="auth-input-icon" />

              <input
                type="email"
                id="email"
                placeholder={t("Enter your email")}
                value={formData.email}
                onChange={handleChange}
                autoComplete="email"
                required
              />

            </div>

          </div>


          {/* PASSWORD */}

          <div className="auth-input-group">

            <label htmlFor="password">
              {t("Password")}
            </label>

            <div className="auth-input-wrapper">

              <FaLock className="auth-input-icon" />

              <input
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                id="password"
                placeholder={t("Enter your password")}
                value={formData.password}
                onChange={handleChange}
                autoComplete="new-password"
                required
              />

              <button
                type="button"
                className="password-toggle"
                onClick={() =>
                  setShowPassword(!showPassword)
                }
              >

                {showPassword
                  ? <FaEyeSlash />
                  : <FaEye />
                }

              </button>

            </div>

          </div>


          {/* CONFIRM PASSWORD */}

          <div className="auth-input-group">

            <label htmlFor="confirmPassword">
              {t("Confirm Password")}
            </label>

            <div className="auth-input-wrapper">

              <FaLock className="auth-input-icon" />

              <input
                type={
                  showConfirmPassword
                    ? "text"
                    : "password"
                }
                id="confirmPassword"
                placeholder={t("Confirm your password")}
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);

                  if (display) {
                    setDisplay("");
                    setMessageType("");
                  }
                }}
                autoComplete="new-password"
                required
              />

              <button
                type="button"
                className="password-toggle"
                onClick={() =>
                  setShowConfirmPassword(
                    !showConfirmPassword
                  )
                }
              >

                {showConfirmPassword
                  ? <FaEyeSlash />
                  : <FaEye />
                }

              </button>

            </div>

          </div>


          {/* MESSAGE */}

          {display && (

            <div
              className={`auth-message ${messageType}`}
            >
              {display}
            </div>

          )}


          {/* BUTTON */}

          <button
            type="submit"
            className="auth-submit-btn"
            disabled={loading}
          >

            {loading ? (

              <span className="auth-spinner"></span>

            ) : (

              <>
                {t("Register")}
                <FaArrowRight />
              </>

            )}

          </button>


          {/* LOGIN */}

          <div className="auth-bottom-link">

            <span>
              {t("Already have an account?")}
            </span>

            <Link to="/login">
              {t("Login Here")}
            </Link>

          </div>

        </form>

      </div>

    </div>
  );
};

export default Register;