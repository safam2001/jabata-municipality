
import React, { useEffect, useMemo, useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import { useTranslation } from "react-i18next";
import { showAppModal } from "../../utils/modal";
import "./AdminServices.css";

const AdminServices = () => {
  const [services, setServices] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingService, setEditingService] = useState(null);


  const [searchTerm, setSearchTerm] = useState("");
const [statusFilter, setStatusFilter] = useState("all");
  const { t } = useTranslation();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "active",
    icon: "",
  });

  // =========================
  // Fetch Services
  // =========================

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const res = await axiosInstance.get("/api/services");
      setServices(res.data);
    } catch (err) {
      console.error(err);
    }
  };
// =========================
// Search + Filter
// =========================

const filteredServices = useMemo(() => {
  const search = searchTerm.toLowerCase().trim();

  return services.filter((service) => {
    const matchesSearch =
      !search ||
      service.title?.toLowerCase().includes(search) ||
      service.description?.toLowerCase().includes(search);

    const matchesStatus =
      statusFilter === "all" ||
      service.status === statusFilter;

    return matchesSearch && matchesStatus;
  });
}, [services, searchTerm, statusFilter]);
  // =========================
  // Add Service
  // =========================

  const openAddModal = () => {
    setEditingService(null);

    setFormData({
      title: "",
      description: "",
      status: "active",
      icon: "",
    });

    setShowModal(true);
  };

  // =========================
  // Edit Service
  // =========================

  const openEditModal = (service) => {
    setEditingService(service);

    setFormData({
      title: service.title || "",
      description: service.description || "",
      status: service.status || "active",
      icon: service.icon || "",
    });

    setShowModal(true);
  };

  // =========================
  // Save
  // =========================

  const handleSave = async (e) => {
    e.preventDefault();

    console.log(
      "TOKEN SENT:",
      localStorage.getItem("token")
    );

    try {
      if (editingService) {
        await axiosInstance.put(
          `/api/services/${editingService.id}`,
          formData
        );
      } else {
        await axiosInstance.post(
          "/api/services",
          formData
        );
      }

      fetchServices();
      setShowModal(false);
    } catch (err) {
      console.error(err);

      showAppModal(t("serviceSaveError"), { type: "error" });
    }
  };

  // =========================
  // Delete
  // =========================

  const handleDelete = async (id) => {
    if (!(await showAppModal(t("deleteServiceConfirm"), { type: "confirm" }))) {
      return;
    }

    try {
      await axiosInstance.delete(
        `/api/services/${id}`
      );

      fetchServices();
    } catch (err) {
      console.error(err);

      showAppModal(t("serviceDeleteError"), { type: "error" });
    }
  };

  // =========================
  // Render
  // =========================

  return (
    <div className="admin-services-page">

      {/* Header */}

      <div className="header">

        <h2>
          {t("manageServices")}
        </h2>

        <button
          className="add-btn"
          onClick={openAddModal}
        >
          {t("addService")}
        </button>

      </div>
{/* =========================
    Search + Filter
========================= */}

<div className="services-toolbar">

  <div className="services-search">

    <span>🔎</span>

    <input
      type="text"
      placeholder={t("searchServices")}
      value={searchTerm}
      onChange={(e) =>
        setSearchTerm(e.target.value)
      }
    />

    {searchTerm && (
      <button
        type="button"
        className="clear-services-search"
        onClick={() => setSearchTerm("")}
      >
        ×
      </button>
    )}

  </div>

  <div className="services-filter">

    <label>
      {t("status")}
    </label>

    <select
      value={statusFilter}
      onChange={(e) =>
        setStatusFilter(e.target.value)
      }
    >

      <option value="all">
        {t("all")}
      </option>

      <option value="active">
        {t("active")}
      </option>

      <option value="inactive">
        {t("inactive")}
      </option>

    </select>

  </div>

</div>
      {/* =========================
          Services Table
      ========================= */}

      <table className="services-table">

        <thead>

          <tr>

            <th>#</th>

            <th>
              {t("title")}
            </th>

            <th>
              {t("description")}
            </th>

            <th>
              {t("status")}
            </th>

            <th>
              {t("actions")}
            </th>

          </tr>

        </thead>

        <tbody>

         {filteredServices.length > 0 ? (
  filteredServices.map((service, index) => (

              <tr key={service.id}>

                <td>
                  {index + 1}
                </td>

                <td>
                  {service.title}
                </td>

                <td>
                  {service.description}
                </td>

                <td>

                  <span
                    className={
                      service.status === "active"
                        ? "status-active"
                        : "status-inactive"
                    }
                  >
                    {service.status === "active"
                      ? t("active")
                      : t("inactive")}
                  </span>

                </td>

                <td>

                  <button
                    className="edit-se-btn"
                    onClick={() =>
                      openEditModal(service)
                    }
                  >
                    {t("edit")}
                  </button>

                  <button
                    className="delete-se-btn"
                    onClick={() =>
                      handleDelete(service.id)
                    }
                  >
                    {t("delete")}
                  </button>

                </td>

              </tr>

            ))

          ) : (

            <tr>

              <td colSpan="5">
                {t("noServicesFound")}
              </td>

            </tr>

          )}

        </tbody>

      </table>

      {/* =========================
          Modal
      ========================= */}

      {showModal && (

        <div className="modal-overlay">

          <div className="modal-content">

            <h2>

              {editingService
                ? t("editServiceTitle")
                : t("addServiceTitle")}

            </h2>

            <form onSubmit={handleSave}>

              {/* Service Title */}

              <input
                type="text"
                placeholder={t("serviceTitle")}
                value={formData.title}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    title: e.target.value,
                  })
                }
                required
              />

              {/* Description */}

              <textarea
                placeholder={t("serviceDescription")}
                value={formData.description}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    description:
                      e.target.value,
                  })
                }
              />

              {/* Status */}

              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    status: e.target.value,
                  })
                }
              >

                <option value="active">
                  {t("active")}
                </option>

                <option value="inactive">
                  {t("inactive")}
                </option>

              </select>

              {/* Icon */}

              <select
                value={formData.icon}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    icon: e.target.value,
                  })
                }
              >

                <option value="">
                  {t("serviceIcon")}
                </option>

                <option value="FaUsers">
                  👥 {t("citizens")}
                </option>

                <option value="FaStar">
                  ⭐ {t("martyrs")}
                </option>

                <option value="FaWheelchair">
                  ♿ {t("specialNeeds")}
                </option>

                <option value="FaBuilding">
                  🏢 {t("municipality")}
                </option>

                <option value="FaTree">
                  🌳 {t("environment")}
                </option>

                <option value="FaWater">
                  💧 {t("water")}
                </option>

                <option value="FaHome">
                  🏠 {t("housing")}
                </option>

                <option value="FaCog">
                  ⚙ {t("other")}
                </option>

              </select>

              {/* Buttons */}

              <div className="modal-buttons">

                <button
                  type="submit"
                  className="save-btn"
                >
                  {editingService
                    ? t("update")
                    : t("save")}
                </button>

                <button
                  type="button"
                  className="close-btn"
                  onClick={() =>
                    setShowModal(false)
                  }
                >
                  {t("cancel")}
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  );
};

export default AdminServices;