// import React, { useEffect, useState } from "react";
// import axiosInstance from "../../api/axiosInstance";
// import "./AdminServiceTypes.css";

// import { useTranslation } from "react-i18next";

// const AdminServiceTypes = () => {
//   const [serviceTypes, setServiceTypes] = useState([]);
//   const [services, setServices] = useState([]);
//   const [showModal, setShowModal] = useState(false);
//   const [editingType, setEditingType] = useState(null);
//   const { t } = useTranslation();
// // const{t}=useTranslation
//   const [formData, setFormData] = useState({
//     service_id: "",
//     title: "",
//     description: "",
//     requirements: "",
//     fee: "",
//     link: "",
//     detailsText: "Show Details",
//     requestText: "Submit Request",
//     hasRequestForm: true,
//     status: "active",
//     person_type:"general"
//   });

//   useEffect(() => {
//     fetchServiceTypes();
//     fetchServices();
//   }, []);

//   const fetchServiceTypes = async () => {
//     try {
//       const res = await axiosInstance.get("/api/service-types");
//       setServiceTypes(res.data);
//     } catch (err) {
//       console.log(err);
//     }
//   };

//   const fetchServices = async () => {
//     try {
//       const res = await axiosInstance.get("/api/services");
//       setServices(res.data);
//     } catch (err) {
//       console.log(err);
//     }
//   };

//   const openAddModal = () => {
//     setEditingType(null);
//     setFormData({
//       service_id: "",
//       title: "",
//       description: "",
//       requirements: "",
//       fee: "",
//       link: "",
//       detailsText: "Show Details",
//       requestText: "Submit Request",
//       hasRequestForm: true,
//       status: "active",
//          person_type:"general"
   
//     });
//     setShowModal(true);
//   };

//   const openEditModal = (item) => {
//     setEditingType(item);
//     setFormData({
//       service_id: item.service_id,
//       title: item.title,
//       description: item.description || "",
//       requirements: item.requirements || "",
//       fee: item.fee || "",
//       link: item.link || "",
//       detailsText: item.detailsText || "Show Details",
//       requestText: item.requestText || "Submit Request",
//       hasRequestForm: item.hasRequestForm,
//       status: item.status,
//        person_type:item.person_type||"general",
//     });
//     setShowModal(true);
//   };

//   const handleSave = async (e) => {
//     e.preventDefault();
//     try {
//       if (editingType) {
//         await axiosInstance.put(`/api/service-types/${editingType.id}`, formData);
//       } else {
//         await axiosInstance.post("/api/service-types", formData);
//       }
//       fetchServiceTypes();
//       console.log("formDdta:",formData);
//       setShowModal(false);
//     } catch (err) {
//       console.log(err.response?.data);
//       console.log(err)
//       alert("Error while saving");
//     }
//   };

//   const handleDelete = async (id) => {
//     if (!window.confirm("Are you sure you want to delete this type?")) return;
//     try {
//       await axiosInstance.delete(`/api/service-types/${id}`);
//       fetchServiceTypes();
//     } catch (err) {
//       console.log(err);
//     }
//   };

//   return (
//     <div className="admin-service-types-page">
//       <div className="header">
//         <h2>{t("Manage Service Types")}</h2>
//         <button className="add-btn" onClick={openAddModal}>
//           +{t("addServiceType")}
//         </button>
//       </div>

//       <div className="table-container">
//         <table className="service-types-table">
//           <thead>
//             <tr>
//               <th>#</th>
//               <th>{t("service")}</th>
//               <th>{t("type")}</th>
//               <th>{t("fee")}</th>
//               <th>{t("status")}</th>
//               <th>{t("request")}</th>
//               <th>{t("actions")}</th>
//             </tr>
//           </thead>
//           <tbody>
//             {serviceTypes.length > 0 ? (
//               serviceTypes.map((item, index) => (
//                 <tr key={item.id}>
//                   <td>{index + 1}</td>
//                   <td>{item.Service?.title}</td>
//                   <td>{item.title}</td>
//                   <td>{item.fee || "-"}</td>
//                   <td>
//                     <span
//                       className={
//                         item.status === "active"
//                           ? "status-active"
//                           : "status-inactive"
//                       }
//                     >
//                       {t(item.status)}
//                     </span>
//                   </td>
//                   <td>{item.hasRequestForm ? t("Yes") : t("No")}</td>
//                   <td>
//                     <button
//                       className="edit-ty-btn"
//                       onClick={() => openEditModal(item)}
//                     >
//                       {t("edit")}
//                     </button>
//                     <button
//                       className="delete-ty-btn"
//                       onClick={() => handleDelete(item.id)}
//                     >
//                       {t("delete")}
//                     </button>
//                   </td>
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td colSpan="7">{t("No Service Types Found")}</td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>

//       {showModal && (
//         <div className="modal-overlay">
//           <div className="modal-content">
//             <h2>
//               {editingType ? t("Edit Service Type") : t("Add Service Type")}
//             </h2>
//             <form onSubmit={handleSave}>
//               <select
//                 value={formData.service_id}
//                 onChange={(e) =>
//                   setFormData({ ...formData, service_id: e.target.value })
//                 }
//                 required
//               >
//                 <option value="">{t("selectService")}</option>
//                 {services.map((service) => (
//                   <option key={service.id} value={service.id}>
//                     {service.title}
//                   </option>
//                 ))}
//               </select>

//               <input
//                 type="text"
//                 placeholder="Type Title"
//                 value={formData.title}
//                 onChange={(e) =>
//                   setFormData({ ...formData, title: e.target.value })
//                 }
//                 required
//               />

//               <textarea
//                 placeholder="Description"
//                 value={formData.description}
//                 onChange={(e) =>
//                   setFormData({ ...formData, description: e.target.value })
//                 }
//               />

//               <textarea
//                 placeholder="Requirements"
//                 value={formData.requirements}
//                 onChange={(e) =>
//                   setFormData({ ...formData, requirements: e.target.value })
//                 }
//               />

//               <input
//                 type="number"
//                 placeholder="Fee"
//                 value={formData.fee}
//                 onChange={(e) =>
//                   setFormData({ ...formData, fee: e.target.value })
//                 }
//               />

//               <input
//                 type="text"
//                 placeholder="Service Link"
//                 value={formData.link}
//                 onChange={(e) =>
//                   setFormData({ ...formData, link: e.target.value })
//                 }
//               />

//               <input
//                 type="text"
//                 placeholder="Details Button Text"
//                 value={formData.detailsText}
//                 onChange={(e) =>
//                   setFormData({ ...formData, detailsText: e.target.value })
//                 }
//               />

//               <input
//                 type="text"
//                 placeholder="Request Button Text"
//                 value={formData.requestText}
//                 onChange={(e) =>
//                   setFormData({ ...formData, requestText: e.target.value })
//                 }
//               />

//               <label className="checkbox-label">
//                 <input
//                   type="checkbox"
//                   checked={formData.hasRequestForm}
//                   onChange={(e) =>
//                     setFormData({
//                       ...formData,
//                       hasRequestForm: e.target.checked,
//                     })
//                   }
//                 />
//                 {t("hasRequestForm")}
//               </label>

//               <select
//                 value={formData.status}
//                 onChange={(e) =>
//                   setFormData({ ...formData, status: e.target.value })
//                 }
//               >
//                 <option value="active">{t("Active")}</option>
//                 <option value="inactive">{t("Inactive")}</option>
//               </select>
//               <label>{t("Person Type")}</label>

// <select
//   value={formData.person_type}
//   onChange={(e) =>
//     setFormData({
//       ...formData,
//       person_type: e.target.value,
//     })
//   }
// >
//   <option value="general">{t("General")}</option>
//   <option value="citizen">{t("Citizen")}</option>
//   <option value="martyr">{t("Martyr")}</option>
//   <option value="specialNeeds"> {t("Special Needs")}</option>
// </select>
//               <div className="modal-buttons">
//                 <button className="save-btn" type="submit">
//                   {editingType ? t("update") : t("save")}
//                 </button>
//                 <button
//                   className="close-btn"
//                   type="button"
//                   onClick={() => setShowModal(false)}
//                 >
//                   {t("cancel")}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AdminServiceTypes;
import React, { useEffect, useMemo, useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import "./AdminServiceTypes.css";

import { useTranslation } from "react-i18next";

const AdminServiceTypes = () => {
  const [serviceTypes, setServiceTypes] = useState([]);
  const [services, setServices] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingType, setEditingType] = useState(null);

  const { t } = useTranslation();
// =========================
// Search + Filters
// =========================

const [searchTerm, setSearchTerm] = useState("");
const [serviceFilter, setServiceFilter] = useState("all");
const [statusFilter, setStatusFilter] = useState("all");

const filteredServiceTypes = useMemo(() => {
  const search = searchTerm.toLowerCase().trim();

  return serviceTypes.filter((item) => {
    const matchesSearch =
      !search ||
      item.title?.toLowerCase().includes(search) ||
      item.Service?.title?.toLowerCase().includes(search);

    const matchesService =
      serviceFilter === "all" ||
      String(item.service_id) === String(serviceFilter);

    const matchesStatus =
      statusFilter === "all" ||
      item.status === statusFilter;

    return (
      matchesSearch &&
      matchesService &&
      matchesStatus
    );
  });
}, [
  serviceTypes,
  searchTerm,
  serviceFilter,
  statusFilter,
]);
  const [formData, setFormData] = useState({
    service_id: "",
    title: "",
    description: "",
    requirements: "",
    fee: "",
    link: "",
    detailsText: "Show Details",
    requestText: "Submit Request",
    hasRequestForm: true,
    status: "active",
    person_type: "general",
  });

  // =========================
  // Fetch Service Types
  // =========================

  useEffect(() => {
    fetchServiceTypes();
    fetchServices();
  }, []);

  const fetchServiceTypes = async () => {
    try {
      const res = await axiosInstance.get("/api/service-types");
      setServiceTypes(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  // =========================
  // Fetch Services
  // =========================

  const fetchServices = async () => {
    try {
      const res = await axiosInstance.get("/api/services");
      setServices(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  // =========================
  // Add
  // =========================

  const openAddModal = () => {
    setEditingType(null);

    setFormData({
      service_id: "",
      title: "",
      description: "",
      requirements: "",
      fee: "",
      link: "",
      detailsText: "Show Details",
      requestText: "Submit Request",
      hasRequestForm: true,
      status: "active",
      person_type: "general",
    });

    setShowModal(true);
  };

  // =========================
  // Edit
  // =========================

  const openEditModal = (item) => {
    setEditingType(item);

    setFormData({
      service_id: item.service_id,
      title: item.title,
      description: item.description || "",
      requirements: item.requirements || "",
      fee: item.fee || "",
      link: item.link || "",
      detailsText: item.detailsText || "Show Details",
      requestText: item.requestText || "Submit Request",
      hasRequestForm: item.hasRequestForm,
      status: item.status,
      person_type: item.person_type || "general",
    });

    setShowModal(true);
  };

  // =========================
  // Save
  // =========================

  const handleSave = async (e) => {
    e.preventDefault();

    try {
      if (editingType) {
        await axiosInstance.put(
          `/api/service-types/${editingType.id}`,
          formData
        );
      } else {
        await axiosInstance.post(
          "/api/service-types",
          formData
        );
      }

      fetchServiceTypes();

      console.log("formData:", formData);

      setShowModal(false);
    } catch (err) {
      console.log(err.response?.data);
      console.log(err);

      alert(t("errorWhileSaving"));
    }
  };

  // =========================
  // Delete
  // =========================

  const handleDelete = async (id) => {
    if (!window.confirm(t("confirmDeleteServiceType"))) {
      return;
    }

    try {
      await axiosInstance.delete(
        `/api/service-types/${id}`
      );

      fetchServiceTypes();
    } catch (err) {
      console.log(err);
    }
  };

  // =========================
  // Render
  // =========================

  return (
    <div className="admin-service-types-page">

      {/* Header */}

      <div className="header">

        <h2>
          {t("manageServiceTypes")}
        </h2>

        <button
          className="add-btn"
          onClick={openAddModal}
        >
          + {t("addServiceType")}
        </button>

      </div>
      {/* =========================
    Search + Filters
========================= */}

<div className="service-types-filters">

  {/* Search */}

  <div className="service-types-search">

    <input
      type="text"
      placeholder={t("searchServiceTypes")}
      value={searchTerm}
      onChange={(e) =>
        setSearchTerm(e.target.value)
      }
    />

  </div>

  {/* Service Filter */}

  <div className="service-types-filter">

    <select
      value={serviceFilter}
      onChange={(e) =>
        setServiceFilter(e.target.value)
      }
    >

      <option value="all">
        {t("allServices")}
      </option>

      {services.map((service) => (
        <option
          key={service.id}
          value={service.id}
        >
          {service.title}
        </option>
      ))}

    </select>

  </div>

  {/* Status Filter */}

  <div className="service-types-filter">

    <select
      value={statusFilter}
      onChange={(e) =>
        setStatusFilter(e.target.value)
      }
    >

      <option value="all">
        {t("allStatuses")}
      </option>

      <option value="active">
        {t("active")}
      </option>

      <option value="inactive">
        {t("inactive")}
      </option>

    </select>

  </div>

  {/* Reset */}

  <button
    type="button"
    className="reset-service-types-filters"
    onClick={() => {
      setSearchTerm("");
      setServiceFilter("all");
      setStatusFilter("all");
    }}
  >
    {t("reset")}
  </button>

</div>

<div className="service-types-results">
  {t("showing")}{" "}
  <strong>{filteredServiceTypes.length}</strong>{" "}
  {t("of")}{" "}
  <strong>{serviceTypes.length}</strong>
</div>

      {/* Table */}

      <div className="table-container">

        <table className="service-types-table">

          <thead>

            <tr>

              <th>#</th>

              <th>
                {t("service")}
              </th>

              <th>
                {t("type")}
              </th>

              <th>
                {t("fee")}
              </th>

              <th>
                {t("status")}
              </th>

              <th>
                {t("request")}
              </th>

              <th>
                {t("actions")}
              </th>

            </tr>

          </thead>

          <tbody>

           {filteredServiceTypes.length > 0 ? (

  filteredServiceTypes.map((item, index) => (

                <tr key={item.id}>

                  <td>
                    {index + 1}
                  </td>

                  <td>
                    {item.Service?.title}
                  </td>

                  <td>
                    {item.title}
                  </td>

                  <td>
                    {item.fee || "-"}
                  </td>

                  <td>

                    <span
                      className={
                        item.status === "active"
                          ? "status-active"
                          : "status-inactive"
                      }
                    >
                      {t(item.status)}
                    </span>

                  </td>

                  <td>
                    {item.hasRequestForm
                      ? t("yes")
                      : t("no")}
                  </td>

                  <td>

                    <button
                      className="edit-ty-btn"
                      onClick={() =>
                        openEditModal(item)
                      }
                    >
                      {t("edit")}
                    </button>

                    <button
                      className="delete-ty-btn"
                      onClick={() =>
                        handleDelete(item.id)
                      }
                    >
                      {t("delete")}
                    </button>

                  </td>

                </tr>

              ))

            ) : (

              <tr>

                <td colSpan="7">
                  {t("noServiceTypesFound")}
                </td>

              </tr>

            )}

          </tbody>

        </table>

      </div>

      {/* Modal */}

      {showModal && (

        <div className="modal-overlay">

          <div className="modal-content">

            <h2>
              {editingType
                ? t("editServiceType")
                : t("addServiceType")}
            </h2>

            <form onSubmit={handleSave}>

              {/* Service */}

              <select
                value={formData.service_id}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    service_id: e.target.value,
                  })
                }
                required
              >

                <option value="">
                  {t("selectService")}
                </option>

                {services.map((service) => (

                  <option
                    key={service.id}
                    value={service.id}
                  >
                    {service.title}
                  </option>

                ))}

              </select>

              {/* Type Title */}

              <input
                type="text"
                placeholder={t("typeTitle")}
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
                placeholder={t("description")}
                value={formData.description}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    description: e.target.value,
                  })
                }
              />

              {/* Requirements */}

              <textarea
                placeholder={t("requirements")}
                value={formData.requirements}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    requirements: e.target.value,
                  })
                }
              />

              {/* Fee */}

              <input
                type="number"
                placeholder={t("fee")}
                value={formData.fee}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    fee: e.target.value,
                  })
                }
              />

              {/* Service Link */}

              <input
                type="text"
                placeholder={t("serviceLink")}
                value={formData.link}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    link: e.target.value,
                  })
                }
              />

              {/* Details Button Text */}

              <input
                type="text"
                placeholder={t("detailsButtonText")}
                value={formData.detailsText}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    detailsText: e.target.value,
                  })
                }
              />

              {/* Request Button Text */}

              <input
                type="text"
                placeholder={t("requestButtonText")}
                value={formData.requestText}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    requestText: e.target.value,
                  })
                }
              />

              {/* Request Form */}

              <label className="checkbox-label">

                <input
                  type="checkbox"
                  checked={formData.hasRequestForm}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      hasRequestForm:
                        e.target.checked,
                    })
                  }
                />

                {t("hasRequestForm")}

              </label>

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

              {/* Person Type */}

              <label>
                {t("personType")}
              </label>

              <select
                value={formData.person_type}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    person_type: e.target.value,
                  })
                }
              >

                <option value="general">
                  {t("general")}
                </option>

                <option value="citizen">
                  {t("citizen")}
                </option>

                <option value="martyr">
                  {t("martyr")}
                </option>

                <option value="specialNeeds">
                  {t("specialNeeds")}
                </option>

              </select>

              {/* Buttons */}

              <div className="modal-buttons">

                <button
                  className="save-btn"
                  type="submit"
                >
                  {editingType
                    ? t("update")
                    : t("save")}
                </button>

                <button
                  className="close-btn"
                  type="button"
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

export default AdminServiceTypes;