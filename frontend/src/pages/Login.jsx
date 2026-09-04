
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import { useTranslation } from "react-i18next";

import {
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaArrowRight,
  FaShieldAlt
} from "react-icons/fa";

import "./Login.css";

const Login = ({ onLogin }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const [display, setDisplay] = useState("");
  const [messageType, setMessageType] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    });

    // إزالة الرسالة عند بدء التعديل
    if (display) {
      setDisplay("");
      setMessageType("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setDisplay("");
    setMessageType("");

    if (!formData.email.trim() || !formData.password.trim()) {
      setDisplay(t("Please fill in all required fields"));
      setMessageType("error");
      return;
    }

    setLoading(true);

    try {
      const response = await axiosInstance.post(
        "/api/auth/login",
        formData
      );

      if (response.data?.token && response.data?.user) {

        localStorage.setItem(
          "token",
          response.data.token
        );

        localStorage.setItem(
          "user",
          JSON.stringify(response.data.user)
        );

        if (onLogin) {
          onLogin(response.data.user);
        }

        setDisplay(
          response.data.user.role === "admin"
            ? t("Login successful! Redirecting to dashboard...")
            : t("Login successful! Redirecting...")
        );

        setMessageType("success");

        setTimeout(() => {

          if (response.data.user.role === "admin") {
            navigate("/admin/dashboard");
          } else {
            navigate("/");
          }

        }, 900);

      } else {

        setDisplay(
          t("Invalid response from server. Please try again.")
        );

        setMessageType("error");
      }

    } catch (error) {

      console.error("Login error:", error);

      const errorMessage =
        error.response?.data?.message ||
        t("Invalid email or password");

      setDisplay(errorMessage);
      setMessageType("error");

    } finally {

      setLoading(false);

    }
  };

  return (
    <div className="login-page">

      <div className="auth-overlay"></div>

      <div className="login-container">

        {/* الجانب التعريفي */}

        <div className="auth-info">

          <div className="auth-info-icon">
            <FaShieldAlt />
          </div>

          <h1>
            {t("Jabata Al-Khashab Municipality")}
          </h1>

          <p>
            {t(
              "Welcome to the official municipality platform"
            )}
          </p>

        </div>


        {/* الفورم */}

        <form
          className="login-form"
          onSubmit={handleSubmit}
        >

          <div className="auth-form-header">

            <div className="auth-mobile-icon">
              <FaShieldAlt />
            </div>

            <h2>
              {t("login")}
            </h2>

            <p>
              {t("Sign in to your account")}
            </p>

          </div>


          {/* Email */}

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


          {/* Password */}

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
                autoComplete="current-password"
                required
              />

              <button
                type="button"
                className="password-toggle"
                onClick={() =>
                  setShowPassword(!showPassword)
                }
                aria-label={
                  showPassword
                    ? t("Hide password")
                    : t("Show password")
                }
              >

                {showPassword
                  ? <FaEyeSlash />
                  : <FaEye />
                }

              </button>

            </div>

          </div>


          {/* Message */}

          {display && (

            <div
              className={`auth-message ${messageType}`}
            >
              {display}
            </div>

          )}


          {/* Submit */}

          <button
            type="submit"
            className="auth-submit-btn"
            disabled={loading}
          >

            {loading ? (
              <span className="auth-spinner"></span>
            ) : (
              <>
                {t("Login")}
                <FaArrowRight />
              </>
            )}

          </button>


          {/* Register */}

          <div className="auth-bottom-link">

            <span>
              {t("Don't have an account?")}
            </span>

            <Link to="/register">
              {t("Register Here")}
            </Link>

          </div>

        </form>

      </div>

    </div>
  );
};

export default Login;