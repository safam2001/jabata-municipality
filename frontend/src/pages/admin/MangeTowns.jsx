// import React, { useEffect, useState } from "react";
// import axiosInstance from "../../api/axiosInstance";
// import { useTranslation } from "react-i18next";

// import "./MangeTowns.css";

// const ManageTowns = () => {

//   const { t } = useTranslation();

//   const [towns, setTowns] = useState([]);

//   const [loading, setLoading] = useState(true);

//   const [search, setSearch] = useState("");

//   const [successMessage, setSuccessMessage] = useState("");

//   const [showModal, setShowModal] = useState(false);

//   const [editingId, setEditingId] = useState(null);

//   const [formData, setFormData] = useState({
//     name: "",
//     description: "",
//     latitude: "",
//     longitude: "",
//     population: "",
//     area: "",
//     logo_url: ""
//   });

//   useEffect(() => {
//     fetchTowns();
//   }, []);

//   useEffect(() => {

//     if (successMessage) {

//       const timer = setTimeout(() => {
//         setSuccessMessage("");
//       }, 3000);

//       return () => clearTimeout(timer);

//     }

//   }, [successMessage]);

//   const fetchTowns = async () => {

//     try {

//       setLoading(true);

//       const res = await axiosInstance.get("/api/towns");

//       setTowns(res.data);

//     } catch (err) {

//       console.error(err);

//     } finally {

//       setLoading(false);

//     }

//   };

//   const handleChange = (e) => {

//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value
//     });

//   };

//   const resetForm = () => {

//     setEditingId(null);

//     setFormData({
//       name: "",
//       description: "",
//       latitude: "",
//       longitude: "",
//       population: "",
//       area: "",
//       logo_url: ""
//     });

//   };

//   const openAdd = () => {

//     resetForm();

//     setShowModal(true);

//   };

//   const openEdit = (town) => {

//     setEditingId(town.id);

//     setFormData({

//       name: town.name ?? "",

//       description: town.description ?? "",

//       latitude: town.latitude ?? "",

//       longitude: town.longitude ?? "",

//       population: town.population ?? "",

//       area: town.area ?? "",

//       logo_url: town.logo_url ?? ""

//     });

//     setShowModal(true);

//   };

//   const saveTown = async () => {

//     try {

//       if (editingId) {

//         await axiosInstance.put(
//           `/api/towns/${editingId}`,
//           formData
//         );

//         setSuccessMessage(t("townUpdated"));

//       } else {

//         await axiosInstance.post(
//           "/api/towns",
//           formData
//         );

//         setSuccessMessage(t("townAdded"));

//       }

//       setShowModal(false);

//       resetForm();

//       fetchTowns();

//     } catch (err) {

//       console.error(err);

//     }

//   };

//   const deleteTown = async (id) => {

//     const confirmDelete = await showAppModal(
//       t("confirmDelete")
//     );

//     if (!confirmDelete) return;

//     try {

//       await axiosInstance.delete(
//         `/api/towns/${id}`
//       );

//       setSuccessMessage(
//         t("townDeleted")
//       );

//       fetchTowns();

//     } catch (err) {

//       console.error(err);

//     }

//   };

//   const filteredTowns = towns.filter((item) =>
//     item.name
//       ?.toLowerCase()
//       .includes(search.toLowerCase())
//   );

//   const totalTowns = towns.length;

//   const totalPopulation = towns.reduce(
//     (sum, town) => sum + (Number(town.population) || 0),
//     0
//   );

//   const totalArea = towns.reduce(
//     (sum, town) => sum + (Number(town.area) || 0),
//     0
//   );
//   return (
//     <div className="towns-container">

//       <div className="page-header">

//         <div>
//           <h2>{t("manageTowns")}</h2>
//           {/* <p>{t("manageTownsDescription")}</p> */}
//         </div>

//         <button
//           className="add-btn"
//           onClick={openAdd}
//         >
//           + {t("addTown")}
//         </button>

//       </div>

//       <div className="stats-container">

//         <div className="stat-card">
//           <h3>{totalTowns}</h3>
//           <span>{t("totalTowns")}</span>
//         </div>

//         <div className="stat-card">
//           <h3>{totalPopulation}</h3>
//           <span>{t("population")}</span>
//         </div>

//         <div className="stat-card">
//           <h3>{totalArea}</h3>
//           <span>{t("area")}</span>
//         </div>

//       </div>

//       {successMessage && (
//         <div className="success-message">
//           {successMessage}
//         </div>
//       )}

//       <div className="toolbar">

//         <input
//           type="text"
//           placeholder={t("searchTown")}
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//         />

//       </div>

//       {loading ? (

//         <div className="loading-box">
//           {t("loading")}
//         </div>

//       ) : filteredTowns.length === 0 ? (

//         <div className="empty-box">
//           {t("noTowns")}
//         </div>

//       ) : (

//         <div className="towns-grid">

//           {filteredTowns.map((town) => (

//             <div
//               key={town.id}
//               className="town-card"
//             >

//               <div className="town-header">

//                 <h3>{town.name}</h3>

//               </div>

//               <p>{town.description}</p>

//               <div className="town-info">

//                 <span>
//                   👥 {town.population || "-"}
//                 </span>

//                 <span>
//                   📐 {town.area || "-"} km²
//                 </span>

//                 <span>
//                   📍 {town.latitude || "-"} , {town.longitude || "-"}
//                 </span>

//               </div>

//               {town.logo_url && (

//                 <img
//                   src={town.logo_url}
//                   alt={town.name}
//                   className="town-image"
//                 />

//               )}

//               <div className="actions">

//                 <button
//                   className="edit-btn"
//                   onClick={() => openEdit(town)}
//                 >
//                   {t("edit")}
//                 </button>

//                 <button
//                   className="delete-btn"
//                   onClick={() => deleteTown(town.id)}
//                 >
//                   {t("delete")}
//                 </button>

//               </div>

//             </div>

//           ))}

//         </div>

//       )}

//       {showModal && (

//         <div className="modal-overlay">

//           <div className="modal">

//             <h3>

//               {editingId
//                 ? t("editTown")
//                 : t("addTown")}

//             </h3>

//             <input
//               type="text"
//               name="name"
//               placeholder={t("townName")}
//               value={formData.name}
//               onChange={handleChange}
//             />

//             <textarea
//               name="description"
//               placeholder={t("description")}
//               value={formData.description}
//               onChange={handleChange}
//             />

//             <input
//               type="number"
//               name="population"
//               placeholder={t("population")}
//               value={formData.population}
//               onChange={handleChange}
//             />

//             <input
//               type="number"
//               step="0.01"
//               name="area"
//               placeholder={t("area")}
//               value={formData.area}
//               onChange={handleChange}
//             />

//             <input
//               type="number"
//               step="0.000001"
//               name="latitude"
//               placeholder={t("latitude")}
//               value={formData.latitude}
//               onChange={handleChange}
//             />

//             <input
//               type="number"
//               step="0.000001"
//               name="longitude"
//               placeholder={t("longitude")}
//               value={formData.longitude}
//               onChange={handleChange}
//             />

//             <input
//               type="text"
//               name="logo_url"
//               placeholder={t("logoUrl")}
//               value={formData.logo_url}
//               onChange={handleChange}
//             />

//             <div className="modal-actions">

//               <button
//                 className="save-btn"
//                 onClick={saveTown}
//               >
//                 {editingId
//                   ? t("saveChanges")
//                   : t("add")}
//               </button>

//               <button
//                 className="cancel-btn"
//                 onClick={() => {
//                   setShowModal(false);
//                   resetForm();
//                 }}
//               >
//                 {t("cancel")}
//               </button>

//             </div>

//           </div>

//         </div>

//       )}

//     </div>
//   );

// };

// export default ManageTowns;
import React, { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import { useTranslation } from "react-i18next";
import { showAppModal } from "../../utils/modal";

import {
  FaUsers,
  FaRulerCombined,
  FaMapMarkerAlt
} from "react-icons/fa";

import "./MangeTowns.css";

const ManageTowns = () => {

  const { t } = useTranslation();

  const [towns, setTowns] = useState([]);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [successMessage, setSuccessMessage] = useState("");

  const [showModal, setShowModal] = useState(false);

  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    latitude: "",
    longitude: "",
    population: "",
    area: "",
    logo_url: ""
  });

  useEffect(() => {
    fetchTowns();
  }, []);

  useEffect(() => {

    if (successMessage) {

      const timer = setTimeout(() => {
        setSuccessMessage("");
      }, 3000);

      return () => clearTimeout(timer);

    }

  }, [successMessage]);

  const fetchTowns = async () => {

    try {

      setLoading(true);

      const res = await axiosInstance.get("/api/towns");

      setTowns(res.data);

    } catch (err) {

      console.error("Error fetching towns:", err);

    } finally {

      setLoading(false);

    }

  };

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });

  };

  const resetForm = () => {

    setEditingId(null);

    setFormData({
      name: "",
      description: "",
      latitude: "",
      longitude: "",
      population: "",
      area: "",
      logo_url: ""
    });

  };

  const openAdd = () => {

    resetForm();

    setShowModal(true);

  };

  const openEdit = (town) => {

    setEditingId(town.id);

    setFormData({

      name: town.name ?? "",

      description: town.description ?? "",

      latitude: town.latitude ?? "",

      longitude: town.longitude ?? "",

      population: town.population ?? "",

      area: town.area ?? "",

      logo_url: town.logo_url ?? ""

    });

    setShowModal(true);

  };

  const saveTown = async () => {

    try {

      console.log("Sending town data:", formData);

      if (editingId) {

        await axiosInstance.put(
          `/api/towns/${editingId}`,
          formData
        );

        setSuccessMessage(t("townUpdated"));

      } else {

        await axiosInstance.post(
          "/api/towns",
          formData
        );

        setSuccessMessage(t("townAdded"));

      }

      setShowModal(false);

      resetForm();

      fetchTowns();

    } catch (err) {

      console.error(
        "Town save error:",
        err.response?.data || err
      );

    }

  };

  const deleteTown = async (id) => {

    const confirmDelete = await showAppModal(
      t("confirmDelete"),
      { type: "confirm" }
    );

    if (!confirmDelete) return;

    try {

      await axiosInstance.delete(
        `/api/towns/${id}`
      );

      setSuccessMessage(
        t("townDeleted")
      );

      fetchTowns();

    } catch (err) {

      console.error(
        "Town delete error:",
        err.response?.data || err
      );

    }

  };

  const filteredTowns = towns.filter((item) =>
    item.name
      ?.toLowerCase()
      .includes(search.toLowerCase())
  );

  const totalTowns = towns.length;

  const totalPopulation = towns.reduce(
    (sum, town) =>
      sum + (Number(town.population) || 0),
    0
  );

  const totalArea = towns.reduce(
    (sum, town) =>
      sum + (Number(town.area) || 0),
    0
  );

  return (

    <div className="towns-container">

      <div className="page-header">

        <div>

          <h2>
            {t("manageTowns")}
          </h2>

        </div>

        <button
          className="add-btn"
          onClick={openAdd}
        >
          + {t("addTown")}
        </button>

      </div>


      <div className="stats-container">

        <div className="stat-card">

          <h3>
            {totalTowns}
          </h3>

          <span>
            {t("totalTowns")}
          </span>

        </div>


        <div className="stat-card">

          <h3>
            {totalPopulation.toLocaleString()}{" "}
            {t("person")}
          </h3>

          <span>
            {t("population")}
          </span>

        </div>


        <div className="stat-card">

          <h3>
            {totalArea.toLocaleString()}{" "}
            {t("squareKilometer")}
          </h3>

          <span>
            {t("area")}
          </span>

        </div>

      </div>


      {successMessage && (

        <div className="success-message">
          {successMessage}
        </div>

      )}


      <div className="toolbar">

        <input
          type="text"
          placeholder={t("searchTown")}
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
        />

      </div>


      {loading ? (

        <div className="loading-box">
          {t("loading")}
        </div>

      ) : filteredTowns.length === 0 ? (

        <div className="empty-box">
          {t("noTowns")}
        </div>

      ) : (

        <div className="towns-grid">

          {filteredTowns.map((town) => (

            <div
              key={town.id}
              className="town-card"
            >

              <div className="town-header">

                <h3>
                  {town.name}
                </h3>

              </div>


              <p>
                {town.description}
              </p>


              <div className="town-info">

                <span>

                  <FaUsers />

                  {town.population
                    ? `${Number(
                        town.population
                      ).toLocaleString()} ${t(
                        "person"
                      )}`
                    : "-"}

                </span>


                <span>

                  <FaRulerCombined />

                  {town.area
                    ? `${Number(
                        town.area
                      ).toLocaleString()} ${t(
                        "squareKilometer"
                      )}`
                    : "-"}

                </span>


                <span>

                  <FaMapMarkerAlt />

                  {town.latitude || "-"} ,{" "}
                  {town.longitude || "-"}

                </span>

              </div>


              {town.logo_url && (

                <img
                  src={town.logo_url}
                  alt={town.name}
                  className="town-image"
                />

              )}


              <div className="actions">

                <button
                  className="edit-btn"
                  onClick={() =>
                    openEdit(town)
                  }
                >
                  {t("edit")}
                </button>


                <button
                  className="delete-btn"
                  onClick={() =>
                    deleteTown(town.id)
                  }
                >
                  {t("delete")}
                </button>

              </div>

            </div>

          ))}

        </div>

      )}


      {showModal && (

        <div className="modal-overlay">

          <div className="modal">

            <h3>

              {editingId
                ? t("editTown")
                : t("addTown")}

            </h3>


            <input
              type="text"
              name="name"
              placeholder={t("townName")}
              value={formData.name}
              onChange={handleChange}
            />


            <textarea
              name="description"
              placeholder={t("description")}
              value={formData.description}
              onChange={handleChange}
            />


            <div className="input-with-unit">

              <input
                type="number"
                name="population"
                placeholder={t("population")}
                value={formData.population}
                onChange={handleChange}
              />

              <span>
                {t("person")}
              </span>

            </div>


            <div className="input-with-unit">

              <input
                type="number"
                step="0.01"
                name="area"
                placeholder={t("area")}
                value={formData.area}
                onChange={handleChange}
              />

              <span>
                {t("squareKilometer")}
              </span>

            </div>


            <input
              type="number"
              step="0.000001"
              name="latitude"
              placeholder={t("latitude")}
              value={formData.latitude}
              onChange={handleChange}
            />


            <input
              type="number"
              step="0.000001"
              name="longitude"
              placeholder={t("longitude")}
              value={formData.longitude}
              onChange={handleChange}
            />


            <input
              type="text"
              name="logo_url"
              placeholder={t("logoUrl")}
              value={formData.logo_url}
              onChange={handleChange}
            />


            <div className="modal-actions">

              <button
                className="save-btn"
                onClick={saveTown}
              >

                {editingId
                  ? t("saveChanges")
                  : t("add")}

              </button>


              <button
                className="cancel-btn"
                onClick={() => {

                  setShowModal(false);

                  resetForm();

                }}
              >

                {t("cancel")}

              </button>

            </div>

          </div>

        </div>

      )}

    </div>

  );

};

export default ManageTowns;