
import React, { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import { useTranslation } from "react-i18next";
import "./MangeVillages.css";

const ManageVillages = () => {
  const { t } = useTranslation();

  const [villages, setVillages] = useState([]);
  const [towns, setTowns] = useState([]);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [successMessage, setSuccessMessage] = useState("");

  const [showModal, setShowModal] = useState(false);

  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    name_ar: "",
    name_en: "",
    description: "",
    description_ar: "",
    description_en: "",
    latitude: "",
    longitude: "",
    population: "",
    area: "",
    media_url: "",
    town_id: "",
  });

  useEffect(() => {
    fetchVillages();
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

  const fetchVillages = async () => {
    try {
      setLoading(true);

      const res = await axiosInstance.get("/api/villages");

      setVillages(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchTowns = async () => {
    try {
      const res = await axiosInstance.get("/api/towns");

      setTowns(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]:
        name === "town_id"
          ? value === ""
            ? null
            : value
          : value,
    });
  };

  const resetForm = () => {
    setEditingId(null);

    setFormData({
      name: "",
      name_ar: "",
      name_en: "",
      description: "",
      description_ar: "",
      description_en: "",
      latitude: "",
      longitude: "",
      population: "",
      area: "",
      media_url: "",
      town_id: "",
    });
  };

  const openAdd = () => {
    resetForm();

    setShowModal(true);
  };

  const openEdit = (village) => {
    setEditingId(village.id);

    setFormData({
      name: village.name ?? "",

      name_ar: village.name_ar ?? "",

      name_en: village.name_en ?? "",

      description: village.description ?? "",

      description_ar: village.description_ar ?? "",

      description_en: village.description_en ?? "",

      latitude: village.latitude ?? "",

      longitude: village.longitude ?? "",

      population: village.population ?? "",

      area: village.area ?? "",

      media_url: village.media_url ?? "",

      town_id: village.town_id ?? "",
    });

    setShowModal(true);
  };

  const saveVillage = async () => {
    try {
      console.log("editingId:", editingId);
      console.log("form data", formData);

      if (editingId) {
        await axiosInstance.put(
          `/api/villages/${editingId}`,
          formData
        );

        setSuccessMessage(t("villageUpdated"));
      } else {
        await axiosInstance.post(
          "/api/villages",
          formData
        );

        console.log("form data", formData);

        setSuccessMessage(t("villageAdded"));
      }

      setShowModal(false);

      resetForm();

      fetchVillages();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteVillage = async (id) => {
    const confirmDelete = window.confirm(
      t("confirmDelete")
    );

    if (!confirmDelete) return;

    try {
      await axiosInstance.delete(
        `/api/villages/${id}`
      );

      setSuccessMessage(
        t("villageDeleted")
      );

      fetchVillages();
    } catch (err) {
      console.error(err);
    }
  };

  const filteredVillages = villages.filter((item) =>
    (
      item.name_ar ||
      item.name_en ||
      item.name ||
      ""
    )
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const totalVillages = villages.length;

  const totalPopulation = villages.reduce(
    (sum, v) =>
      sum + (Number(v.population) || 0),
    0
  );

  const totalArea = villages.reduce(
    (sum, v) =>
      sum + (Number(v.area) || 0),
    0
  );

  return (
    <div className="manage-villages-container">

      <div className="page-header">

        <div>
          <h2>
            {t("manageVillages")}
          </h2>
        </div>

        <button
          className="add-btn"
          onClick={openAdd}
        >
          + {t("addVillage")}
        </button>

      </div>

      {successMessage && (
        <div className="success-message">
          {successMessage}
        </div>
      )}

      {/* <div className="stats-container">

        <div className="stat-card">
          <h3>{totalVillages}</h3>

          <span>
            {t("totalVillages")}
          </span>
        </div>

        <div className="stat-card">
          <h3>{towns.length}</h3>

          <span>
            {t("towns")}
          </span>
        </div>

        <div className="stat-card">
          <h3>{totalPopulation}</h3>

          <span>
            {t("population")}
          </span>
        </div>

        <div className="stat-card">
          <h3>{totalArea}</h3>

          <span>
            {t("area")}
          </span>
        </div>

      </div> */}
<div className="stats-container">

  <div className="stat-card">
    <h3>{totalVillages}</h3>
    <span>{t("totalVillages")}</span>
  </div>

  <div className="stat-card">
    <h3>{towns.length}</h3>
    <span>{t("towns")}</span>
  </div>

  <div className="stat-card">
    <h3>
      {totalPopulation.toLocaleString()}{" "}
      {t("person")}
    </h3>
    <span>{t("population")}</span>
  </div>

  <div className="stat-card">
    <h3>
      {totalArea.toLocaleString()}{" "}
      {t("squareKilometer")}
    </h3>
    <span>{t("area")}</span>
  </div>

</div>
      <div className="toolbar">

        <input
          type="text"
          placeholder={t("searchVillage")}
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

      ) : (

        <div className="table-container">

          <table className="villages-table">

            <thead>

              <tr>

                <th>#</th>

                <th>
                  {t("name")}
                </th>

                <th>
                  {t("town")}
                </th>

                <th>
                  {t("population")}
                </th>

                <th>
                  {t("area")}
                </th>

                <th>
                  {t("actions")}
                </th>

              </tr>

            </thead>

            <tbody>

              {filteredVillages.length === 0 ? (

                <tr>

                  <td colSpan="6">
                    {t("noVillages")}
                  </td>

                </tr>

              ) : (

                filteredVillages.map(
                  (village, index) => (

                    <tr
                      key={village.id}
                    >

                      <td>
                        {index + 1}
                      </td>

                      <td>
                        {village.name_ar ||
                          village.name_en ||
                          village.name ||
                          "-"}
                      </td>

                      <td>
                        {village.town
                          ? village.town.name
                          : "-"}
                      </td>

                      {/* <td>
                        {village.population ||
                          "-"}
                      </td>

                      <td>
                        {village.area ||
                          "-"}
                      </td> */}
                      <td>
  {village.population
    ? `${Number(village.population).toLocaleString()} ${t("person")}`
    : "-"}
</td>

<td>
  {village.area
    ? `${Number(village.area).toLocaleString()} ${t("squareKilometer")}`
    : "-"}
</td>

                      <td>

                        <button
                          className="edit-btn"
                          onClick={() =>
                            openEdit(village)
                          }
                        >
                          {t("edit")}
                        </button>

                        <button
                          className="delete-btn"
                          onClick={() =>
                            deleteVillage(
                              village.id
                            )
                          }
                        >
                          {t("delete")}
                        </button>

                      </td>

                    </tr>

                  )
                )

              )}

            </tbody>

          </table>

        </div>

      )}

      {showModal && (

        <div className="modal-overlay">

          <div className="modal-content">

            <h3>
              {editingId
                ? t("editVillage")
                : t("addVillage")}
            </h3>


            {/* الاسم العربي */}

            <input
              type="text"
              name="name_ar"
              placeholder={t("villageNameArabic")}
              value={formData.name_ar}
              onChange={handleChange}
            />


            {/* الاسم الإنكليزي */}

            <input
              type="text"
              name="name_en"
              placeholder={t("villageNameEnglish")}
              value={formData.name_en}
              onChange={handleChange}
            />


            {/* الاسم القديم - للحفاظ على البيانات القديمة */}

            <input
              type="text"
              name="name"
              placeholder={t("villageName")}
              value={formData.name}
              onChange={handleChange}
            />


            {/* الوصف العربي */}

            <textarea
              name="description_ar"
              placeholder={t("descriptionArabic")}
              value={formData.description_ar}
              onChange={handleChange}
            />


            {/* الوصف الإنكليزي */}

            <textarea
              name="description_en"
              placeholder={t("descriptionEnglish")}
              value={formData.description_en}
              onChange={handleChange}
            />


            {/* الوصف القديم - للحفاظ على البيانات القديمة */}

            <textarea
              name="description"
              placeholder={t("description")}
              value={formData.description}
              onChange={handleChange}
            />


            <select
              name="town_id"
              value={formData.town_id ?? ""}
              onChange={handleChange}
            >

              <option value="">
                {t("selectTown")}
              </option>

              {towns.map((town) => (

                <option
                  key={town.id}
                  value={town.id}
                >
                  {town.name}
                </option>

              ))}

            </select>

<div className="input-with-unit">
  <input
    type="number"
    name="population"
    placeholder={t("population")}
    value={formData.population}
    onChange={handleChange}
  />
  <span>{t("person")}</span>
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
  <span>{t("squareKilometer")}</span>
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
              name="media_url"
              placeholder={t("mediaUrl")}
              value={formData.media_url}
              onChange={handleChange}
            />


            <div className="modal-actions">

              <button
                className="save-btn"
                onClick={saveVillage}
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

export default ManageVillages;