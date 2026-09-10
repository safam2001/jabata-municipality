// import React, { useState, useEffect } from "react";
// import axiosInstance from "../../api/axiosInstance";
// import { useTranslation } from "react-i18next";
// import "./AdminAddPerson.css";

// const AdminAddPerson = () => {
//   const { t } = useTranslation();

//   const [services, setServices] = useState([]);
//   const [serviceTypes, setServiceTypes] = useState([]);

//   const [formData, setFormData] = useState({
//     type: "",
//     service_id: "",
//     service_type_id: "",
//     full_name: "",
//     national_id: "",
//     birth_date: "",
//     address: "",
//     phone: "",
//     notes: "",
//     death_date: "",
//     disability_type: "",
//   });

//   // جلب الخدمات
//   useEffect(() => {
//     const fetchServices = async () => {
//       try {
//         const res = await axiosInstance.get("/api/services");
//         setServices(res.data);
//       } catch (err) {
//         console.error(err);
//       }
//     };

//     fetchServices();
//   }, []);

//   // عند اختيار خدمة → جلب الأنواع المرتبطة
//   const handleServiceChange = async (e) => {
//     const serviceId = e.target.value;

//     setFormData({
//       ...formData,
//       service_id: serviceId,
//       service_type_id: "",
//     });

//     try {
//       const res = await axiosInstance.get(
//         `/api/service-types/service/${serviceId}`
//       );

//       console.log("serviceTypes=", res.data[0]);

//       setServiceTypes(res.data);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;

//     if (name === "service_type_id") {
//       const selected = serviceTypes.find(
//         (item) => String(item.id) === String(value)
//       );

//       console.log("value =", value);
//       console.log("serviceTypes =", serviceTypes);
//       console.log("selected =", selected);

//       setFormData((prev) => ({
//         ...prev,
//         service_type_id: value,
//         type: selected?.person_type || "general",
//       }));
//     } else {
//       setFormData((prev) => ({
//         ...prev,
//         [name]: value,
//       }));
//     }
//   };

//   // حفظ
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       const data = new FormData();

//       // أضيفي الحقول فقط إذا فيها قيمة
//       Object.keys(formData).forEach((key) => {
//         if (formData[key] && key !== "documents") {
//           data.append(key, formData[key]);
//         }
//       });

//       // أضيفي الملفات إذا موجودة
//       if (formData.documents && formData.documents.length > 0) {
//         Array.from(formData.documents).forEach((file) => {
//           data.append("documents", file);
//         });
//       }

//       // Debug
//       console.log("FormData entries:");

//       for (let pair of data.entries()) {
//         console.log(pair[0], pair[1]);
//       }

//       const res = await axiosInstance.post(
//         "/api/requests",
//         data,
//         {
//           headers: {
//             "Content-Type": "multipart/form-data",
//           },
//         }
//       );

//       console.log("Saved:", res.data);

//       showAppModal(t("savedSuccessfully"));

//     } catch (err) {
//       console.error(
//         "Save error:",
//         err.response?.data || err.message
//       );

//       showAppModal(t("errorSavingData"), { type: "error" });
//     }
//   };

//   console.log("formData=", formData);

//   return (
//     <div className="admin-add-person-page">

//       <h2>{t("addPerson")}</h2>

//       <form
//         className="add-person-form"
//         onSubmit={handleSubmit}
//       >

//         {/* الخدمة */}
//         <label>{t("service")}</label>

//         <select
//           name="service_id"
//           value={formData.service_id}
//           onChange={handleServiceChange}
//           required
//         >

//           <option value="">
//             {t("selectService")}
//           </option>

//           {services.map((service) => (

//             <option
//               key={service.id}
//               value={service.id}
//             >
//               {service.title}
//             </option>

//           ))}

//         </select>


//         {/* نوع الشخص / الخدمة */}
//         <label>{t("serviceType")}</label>

//         <select
//           name="service_type_id"
//           value={formData.service_type_id}
//           onChange={handleChange}
//           required
//         >

//           <option value="">
//             {t("selectServiceType")}
//           </option>

//           {serviceTypes.map((item) => (

//             <option
//               key={item.id}
//               value={item.id}
//             >
//               {item.title}
//             </option>

//           ))}

//         </select>


//         {/* الاسم الكامل */}
//         <label>{t("fullName")}</label>

//         <input
//           type="text"
//           name="full_name"
//           value={formData.full_name}
//           onChange={handleChange}
//           required
//         />


//         {/* الرقم الوطني */}
//         <label>{t("nationalId")}</label>

//         <input
//           type="text"
//           name="national_id"
//           value={formData.national_id}
//           onChange={handleChange}
//           required
//         />


//         {/* تاريخ الميلاد */}
//         <label>{t("birthDate")}</label>

//         <input
//           type="date"
//           name="birth_date"
//           value={formData.birth_date}
//           onChange={handleChange}
//         />


//         {/* العنوان */}
//         <label>{t("address")}</label>

//         <input
//           type="text"
//           name="address"
//           value={formData.address}
//           onChange={handleChange}
//           required
//         />


//         {/* الهاتف */}
//         <label>{t("phone")}</label>

//         <input
//           type="text"
//           name="phone"
//           value={formData.phone}
//           onChange={handleChange}
//         />


//         {/* المستندات */}
//         <label>{t("documents")}</label>

//         <input
//           type="file"
//           name="documents"
//           multiple
//           onChange={(e) => {
//             setFormData((prev) => ({
//               ...prev,
//               documents: e.target.files,
//             }));
//           }}
//         />


//         {/* حقول الشهيد */}
//         {formData.type === "martyr" && (
//           <>
//             <label>{t("deathDate")}</label>

//             <input
//               type="date"
//               name="death_date"
//               value={formData.death_date}
//               onChange={handleChange}
//             />
//           </>
//         )}


//         {/* حقول الاحتياجات الخاصة */}
//         {formData.type === "specialNeeds" && (
//           <>
//             <label>{t("disabilityType")}</label>

//             <input
//               type="text"
//               name="disability_type"
//               value={formData.disability_type}
//               onChange={handleChange}
//             />
//           </>
//         )}


//         {/* الملاحظات */}
//         <label>{t("notes")}</label>

//         <textarea
//           name="notes"
//           value={formData.notes}
//           onChange={handleChange}
//         />


//         {/* حفظ */}
//         <button
//           type="submit"
//           className="save-btn"
//         >
//           {t("save")}
//         </button>

//       </form>

//     </div>
//   );
// };

// export default AdminAddPerson;
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";
import { useTranslation } from "react-i18next";
import { isValidPhoneNumber } from "libphonenumber-js";

import RequestForm from "../../components/RequestForm";
import "./AdminAddPerson.css";

const AdminAddPerson = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // =========================
  // Services
  // =========================

  const [services, setServices] = useState([]);
  const [serviceTypes, setServiceTypes] = useState([]);

  const [loadingServices, setLoadingServices] = useState(true);
  const [loadingTypes, setLoadingTypes] = useState(false);
  const [saving, setSaving] = useState(false);

  // =========================
  // Messages
  // =========================

  const [message, setMessage] = useState({
    type: "",
    text: "",
  });

  // =========================
  // Errors
  // =========================

  const [errors, setErrors] = useState({});

  // =========================
  // Form Data
  // =========================

  const initialFormState = {
    type: "",
    service_id: "",
    service_type_id: "",

    full_name: "",
    national_id: "",
    birth_date: "",
    death_date: "",

    disability_type: "",

    address: "",
    phone: "",
    notes: "",

    files: [],
  };

  const [formData, setFormData] = useState(initialFormState);

  // =========================
  // Fetch Services
  // =========================

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setLoadingServices(true);

      const res = await axiosInstance.get("/api/services");

      setServices(res.data || []);
    } catch (err) {
      console.error("Error fetching services:", err);

      setMessage({
        type: "error",
        text: t("somethingWentWrong"),
      });
    } finally {
      setLoadingServices(false);
    }
  };

  // =========================
  // Service Change
  // =========================

  const handleServiceChange = async (e) => {
    const serviceId = e.target.value;

    // تنظيف النوع القديم
    setFormData((prev) => ({
      ...prev,
      service_id: serviceId,
      service_type_id: "",
      type: "",
    }));

    setServiceTypes([]);
    setErrors({});

    if (!serviceId) {
      return;
    }

    try {
      setLoadingTypes(true);

      const res = await axiosInstance.get(
        `/api/service-types/service/${serviceId}`
      );

      setServiceTypes(res.data || []);
    } catch (err) {
      console.error("Error fetching service types:", err);

      setMessage({
        type: "error",
        text: t("somethingWentWrong"),
      });
    } finally {
      setLoadingTypes(false);
    }
  };

  // =========================
  // General Change
  // =========================

  const handleChange = (e) => {
    const { name, value } = e.target;

    // اختيار نوع الخدمة
    if (name === "service_type_id") {
      const selectedType = serviceTypes.find(
        (item) => String(item.id) === String(value)
      );

      const personType =
        selectedType?.person_type || "general";

      setFormData((prev) => ({
        ...prev,
        service_type_id: value,
        type: personType,

        // تنظيف الحقول الخاصة بالنوع السابق
        death_date: "",
        disability_type: "",
      }));

      setErrors({});

      return;
    }

    // الحقول العادية
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // إزالة خطأ الحقل عند تعديله
    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  // =========================
  // File Change
  // =========================

  const handleFile = (e) => {
    const files = Array.from(e.target.files || []);

    const maxSize = 10 * 1024 * 1024;

    const invalidFile = files.find(
      (file) => file.size > maxSize
    );

    if (invalidFile) {
      setMessage({
        type: "error",
        text: t("validation.fileTooLarge"),
      });

      e.target.value = "";

      return;
    }

    setFormData((prev) => ({
      ...prev,
      files,
    }));

    setMessage({
      type: "",
      text: "",
    });
  };

  // =========================
  // Validation
  // =========================

  const validateForm = () => {
    const newErrors = {};

    // Service
    if (!formData.service_id) {
      newErrors.service_id = t(
        "validation.serviceRequired"
      );
    }

    // Service Type
    if (!formData.service_type_id) {
      newErrors.service_type_id = t(
        "validation.serviceTypeRequired"
      );
    }

    // Person Type
    if (!formData.type) {
      newErrors.service_type_id = t(
        "validation.serviceTypeRequired"
      );
    }

    // Full Name
    if (!formData.full_name?.trim()) {
      newErrors.full_name = t(
        "validation.fullNameRequired"
      );
    } else if (
      formData.full_name
        .trim()
        .split(/\s+/)
        .length < 2
    ) {
      newErrors.full_name = t(
        "validation.fullNameTwoWords"
      );
    }

    // National ID
    if (!formData.national_id?.trim()) {
      newErrors.national_id = t(
        "validation.nationalIdRequired"
      );
    } else if (
      !/^[0-9]{8,20}$/.test(
        formData.national_id
      )
    ) {
      newErrors.national_id = t(
        "validation.invalidNationalId"
      );
    }

    // Birth Date
    if (!formData.birth_date) {
      newErrors.birth_date = t(
        "validation.birthDateRequired"
      );
    }

    // Address
    if (!formData.address?.trim()) {
      newErrors.address = t(
        "validation.addressRequired"
      );
    }
//phone
const syrianPhoneRegex = /^9[0-9]{8}$/;

if (!formData.phone) {
  newErrors.phone = t("validation.phoneRequired");
} else if (!syrianPhoneRegex.test(formData.phone)) {
  newErrors.phone = t("validation.invalidPhone");
}

    // =========================
    // Martyr
    // =========================

    if (
      formData.type === "martyr" &&
      !formData.death_date
    ) {
      newErrors.death_date = t(
        "validation.deathDateRequired"
      );
    }

    // =========================
    // Special Needs
    // =========================

    if (
      formData.type === "specialNeeds" &&
      !formData.disability_type?.trim()
    ) {
      newErrors.disability_type = t(
        "validation.disabilityTypeRequired"
      );
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // =========================
  // Submit
  // =========================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (saving) {
      return;
    }

    setMessage({
      type: "",
      text: "",
    });

    // Validation
    if (!validateForm()) {
      return;
    }

    try {
      setSaving(true);

      const data = new FormData();

      // =========================
      // Basic Data
      // =========================

      data.append("type", formData.type);

      data.append(
        "service_id",
        formData.service_id
      );

      data.append(
        "service_type_id",
        formData.service_type_id
      );

      data.append(
        "full_name",
        formData.full_name.trim()
      );

      data.append(
        "national_id",
        formData.national_id.trim()
      );

      data.append(
        "birth_date",
        formData.birth_date
      );

      data.append(
        "address",
        formData.address.trim()
      );

      // =========================
      // Phone
      // =========================
data.append("phone", `+963${formData.phone}`);
      // data.append(
      //   "phone",
      //   formData.phone.replace(/\s/g, "")
      // );

      // =========================
      // Notes
      // =========================

      data.append(
        "notes",
        formData.notes || ""
      );

      // =========================
      // Martyr
      // =========================

      if (formData.type === "martyr") {
        data.append(
          "death_date",
          formData.death_date || ""
        );
      }

      // =========================
      // Special Needs
      // =========================

      if (
        formData.type === "specialNeeds"
      ) {
        data.append(
          "disability_type",
          formData.disability_type || ""
        );
      }

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
      // Debug
      // =========================

      console.log(
        "Admin Request Data:"
      );

      for (const pair of data.entries()) {
        console.log(
          pair[0],
          pair[1]
        );
      }

      // =========================
      // Send
      // =========================

      const token =
        localStorage.getItem("token");

      if (!token) {
        setMessage({
          type: "error",
          text: t("pleaseLoginFirst"),
        });

        navigate("/login");

        return;
      }

      const res =
        await axiosInstance.post(
          "/api/requests",
          data,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

      console.log(
        "Admin request saved:",
        res.data
      );

      // =========================
      // Success
      // =========================

      setMessage({
        type: "success",
        text: t(
          "requestSubmittedSuccessfully"
        ),
      });

      // تنظيف الفورم
      setFormData(initialFormState);
      setServiceTypes([]);
      setErrors({});

    } catch (err) {
      console.error(
        "Admin Add Person Error:",
        err
      );

      const serverMessage =
        err.response?.data?.message;

      if (
        serverMessage ===
        "validation.fullNameTwoWords"
      ) {
        setErrors({
          full_name: t(
            "validation.fullNameTwoWords"
          ),
        });
      } else if (
        serverMessage ===
        "validation.invalidPhone"
      ) {
        setErrors({
          phone: t(
            "validation.invalidPhone"
          ),
        });
      } else if (
        serverMessage ===
        "validation.invalidNationalId"
      ) {
        setErrors({
          national_id: t(
            "validation.invalidNationalId"
          ),
        });
      } else {
        setMessage({
          type: "error",
          text:
            serverMessage
              ? t(serverMessage)
              : t("somethingWentWrong"),
        });
      }
    } finally {
      setSaving(false);
    }
  };

  // =========================
  // Reset
  // =========================

  const handleReset = () => {
    setFormData(initialFormState);
    setServiceTypes([]);
    setErrors({});

    setMessage({
      type: "",
      text: "",
    });
  };

  // =========================
  // Render
  // =========================

  return (
    <div className="admin-add-person-page">

      {/* Header */}

      <div className="admin-add-person-header">

        <button
          type="button"
          className="back-add-btn"
          onClick={() => navigate(-1)}
        >
          {t("back")}
        </button>

        <div>
          <h2>
            {t("addPerson")}
          </h2>

          <p>
            {t("addPersonDescription")}
          </p>
        </div>

      </div>

      {/* Message */}

      {message.text && (
        <div
          className={`admin-form-message ${
            message.type === "success"
              ? "success"
              : "error"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Main Form */}

      <form
        className="add-person-form"
        onSubmit={handleSubmit}
        noValidate
      >

        {/* =========================
            Service
        ========================= */}

        <div className="admin-form-section">

          <h3>
            {t("serviceInformation")}
          </h3>

          <label>
            {t("service")}
          </label>

          <select
            name="service_id"
            value={formData.service_id}
            onChange={handleServiceChange}
            disabled={loadingServices}
            required
            className={
              errors.service_id
                ? "input-error"
                : ""
            }
          >

            <option value="">
              {loadingServices
                ? t("loading")
                : t("selectService")}
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

          {errors.service_id && (
            <span className="error-text">
              {errors.service_id}
            </span>
          )}

          {/* =========================
              Service Type
          ========================= */}

          <label>
            {t("serviceType")}
          </label>

          <select
            name="service_type_id"
            value={formData.service_type_id}
            onChange={handleChange}
            disabled={
              !formData.service_id ||
              loadingTypes
            }
            required
            className={
              errors.service_type_id
                ? "input-error"
                : ""
            }
          >

            <option value="">
              {loadingTypes
                ? t("loading")
                : t("selectServiceType")}
            </option>

            {serviceTypes.map((item) => (
              <option
                key={item.id}
                value={item.id}
              >
                {item.title}
              </option>
            ))}

          </select>

          {errors.service_type_id && (
            <span className="error-text">
              {errors.service_type_id}
            </span>
          )}

        </div>

        {/* =========================
            Request Form
        ========================= */}

        {formData.service_type_id && (
          <div className="admin-form-section">

            <h3>
              {t("personInformation")}
            </h3>

            <RequestForm
              type={formData.type}
              formData={formData}
              errors={errors}
              setErrors={setErrors}
              handleChange={handleChange}
              handleFile={handleFile}
              setFormData={setFormData}
              t={t}
            />

          </div>
        )}

        {/* =========================
            Buttons
        ========================= */}

        <div className="form-buttons">

          <button
            type="submit"
            className="save-btn"
            disabled={
              saving ||
              !formData.service_type_id
            }
          >
            {saving
              ? t("sending")
              : t("save")}
          </button>

          <button
            type="button"
            className="cancel-btn"
            onClick={handleReset}
            disabled={saving}
          >
            {t("cancel")}
          </button>

        </div>

      </form>

    </div>
  );
};

export default AdminAddPerson;