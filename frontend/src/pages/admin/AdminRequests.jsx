// import React, { useEffect, useState } from "react";
// import axiosInstance from "../../api/axiosInstance";
// import { useTranslation } from "react-i18next";
// import "./AdminRequests.css";
// import { useNavigate } from "react-router-dom";

// const AdminRequests = () => {
//   const [requests, setRequests] = useState([]);
//   const { t } = useTranslation();
//   const navigate = useNavigate();
// const formatDateTime = (date) => {
//   return new Date(date).toLocaleString("en-GB", {
//     day: "2-digit",
//     month: "2-digit",
//     year: "numeric",
//     hour: "2-digit",
//     minute: "2-digit",
//   });
// };
//   // 🟢 جلب الطلبات
//   useEffect(() => {
//     axiosInstance
//       .get("/api/requests")   // ✔ تأكدنا إنها requests وليس requests1
//       .then((res) => {

//         setRequests(res.data);
//       })
//       .catch((err) => console.error("Error fetching requests:", err));
//   }, []);

//   // 🟢 تغيير الحالة داخل الواجهة
//   const handleStatusChange = (id, value) => {
//     setRequests((prev) =>
//       prev.map((req) =>
//         req.id === id ? { ...req, status: value } : req
//       )
//     );
//   };

//   // 🟢 تغيير ملاحظات الأدمن داخل الواجهة
//   const handleNotesChange = (id, value) => {
//     setRequests((prev) =>
//       prev.map((req) =>
//         req.id === id ? { ...req, admin_notes: value } : req
//       )
//     );
//   };

//   // 🟢 إرسال التحديث للباكند
//   const handleUpdate = (id) => {
//     const reqData = requests.find((r) => r.id === id);

//     axiosInstance
//       .put(`/api/requests/${id}/status`, {
//         status: reqData.status,
//         admin_notes: reqData.admin_notes,
//       })
//       .then(() => window.location.reload())
//       .catch((err) => console.error("Update error:", err));
//   };

//   // 🟢 حذف طلب
//   const handleDelete = (id) => {
//     axiosInstance
//       .delete(`/api/requests/${id}`)
//       .then(() => window.location.reload())
//       .catch((err) => console.error("Delete error:", err));
//   };

//   return (
//     <div className="admin-page">
//       <div className="page-header">
//         <h2>{t("manageRequests")}</h2>
//       </div>

//       <table className="requests-table">
//         <thead>
//           <tr>
//             <th>{t("fullName")}</th>
//             <th>{t("nationalID")}</th>
//             <th>{t("service")}</th>
//             <th>{t("serviceType")}</th>
//             <th>{t("status")}</th>
//             <th>{t("adminNotes")}</th>
//             {/* <th>{t("Documents")}</th> */}
//             <th>{t("createdAt")}</th>
//             <th>{t("actions")}</th>
//           </tr>
//         </thead>

//         <tbody>
//           {requests.map((req) => (
//             <tr key={req.id}>
//               {/* اسم مقدم الطلب */}
//               <td>

//                 {req.full_name}
//               </td>

//               {/* رقم الهوية */}
//               <td>
//                 {req.national_id}
//               </td>


//               {/* الخدمة */}
//               <td>{req.Service?.title || "-"}</td>



//               {/* نوع الخدمة */}
//               <td>{req.ServiceType?.title}</td>

//               {/* الحالة */}
//               <td>
//                 <select
//                   value={req.status}
//                   onChange={(e) =>
//                     handleStatusChange(req.id, e.target.value)
//                   }
//                 >
//                   <option value="pending">{t("Pending")}</option>
//                   <option value="approved">{t("Approved")}</option>
//                   <option value="rejected">{t("Rejected")}</option>
//                 </select>
//               </td>

//               {/* ملاحظات الأدمن */}
//               <td>
//                 <input
//                   type="text"
//                   placeholder={t("Admin Notes")}
//                   value={req.admin_notes || ""}
//                   onChange={(e) =>
//                     handleNotesChange(req.id, e.target.value)
//                   }
//                 />
//               </td>


//               {/* تاريخ الإنشاء */}
//               {/* <td>{new Date(req.createdAt).toLocaleString()}</td> */}
//  <td>{formatDateTime(req.createdAt)}</td>
//               {/* الأكشنز */}
//               <td>
//                 <div className="actions">
//                   <button
//                     className="details-btn"
//                     onClick={() => navigate(`/admin/requests/${req.id}`)}
//                   >
//                     {t("details")}
//                   </button>

//                   <button
//                     className="update-btn"
//                     onClick={() => handleUpdate(req.id)}
//                   >
//                     {t("update")}
//                   </button>

//                   <button
//                     className="delete-btn"
//                     onClick={() => handleDelete(req.id)}
//                   >
//                     {t("delete")}
//                   </button>
//                 </div>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default AdminRequests;
import React, { useEffect, useMemo, useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import { useTranslation } from "react-i18next";
import { showAppModal } from "../../utils/modal";
import "./AdminRequests.css";
import { useNavigate } from "react-router-dom";
import {
  FaSearch,
  FaTimes,
  FaCheckSquare,
  FaTrash,
} from "react-icons/fa";

const AdminRequests = () => {
  const [requests, setRequests] = useState([]);
  const { t } = useTranslation();
  const navigate = useNavigate();

  // =====================================
  // Selection
  // =====================================

  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [deletingSelected, setDeletingSelected] = useState(false);

  // =====================================
  // Search + Filter
  // =====================================

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  
  // =====================================
  // Date
  // =====================================

  const formatDateTime = (date) => {
    return new Date(date).toLocaleString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // =====================================
  // Fetch Requests
  // =====================================

  useEffect(() => {
    axiosInstance
      .get("/api/requests")
      .then((res) => {
        setRequests(res.data);
      })
      .catch((err) =>
        console.error("Error fetching requests:", err)
      );
  }, []);

  // =====================================
  // Search + Filter
  // =====================================

  const filteredRequests = useMemo(() => {
    const search = searchTerm.toLowerCase().trim();

    return requests.filter((req) => {
      const matchesSearch =
        !search ||
        req.full_name?.toLowerCase().includes(search) ||
        req.national_id?.toLowerCase().includes(search) ||
        req.phone?.toLowerCase().includes(search) ||
        req.Service?.title?.toLowerCase().includes(search) ||
        req.ServiceType?.title?.toLowerCase().includes(search);

      const matchesStatus =
        statusFilter === "all" ||
        req.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [requests, searchTerm, statusFilter]);

  // =====================================
  // Change Status
  // =====================================

  const handleStatusChange = (id, value) => {
    setRequests((prev) =>
      prev.map((req) =>
        req.id === id
          ? { ...req, status: value }
          : req
      )
    );
  };

  // =====================================
  // Change Admin Notes
  // =====================================

  const handleNotesChange = (id, value) => {
    setRequests((prev) =>
      prev.map((req) =>
        req.id === id
          ? { ...req, admin_notes: value }
          : req
      )
    );
  };

  // =====================================
  // Update Request
  // =====================================

  const handleUpdate = (id) => {
    const reqData = requests.find(
      (r) => r.id === id
    );

    axiosInstance
      .put(`/api/requests/${id}/status`, {
        status: reqData.status,
        admin_notes: reqData.admin_notes,
      })
      .then(() => window.location.reload())
      .catch((err) =>
        console.error("Update error:", err)
      );
  };

  // =====================================
  // Delete One Request
  // =====================================

  const handleDelete = (id) => {
    axiosInstance
      .delete(`/api/requests/${id}`)
      .then(() => {
        setRequests((prev) =>
          prev.filter((req) => req.id !== id)
        );

        setSelectedIds((prev) =>
          prev.filter((itemId) => itemId !== id)
        );
      })
      .catch((err) =>
        console.error("Delete error:", err)
      );
  };

  // =====================================
  // Toggle Selection Mode
  // =====================================

  const toggleSelectionMode = () => {
    setSelectionMode((prev) => {
      const newMode = !prev;

      if (!newMode) {
        setSelectedIds([]);
      }

      return newMode;
    });
  };

  // =====================================
  // Select One Request
  // =====================================

  const toggleSelect = (id) => {
    setSelectedIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter(
          (itemId) => itemId !== id
        );
      }

      return [...prev, id];
    });
  };

  // =====================================
  // Select All
  // =====================================

  const toggleSelectAll = () => {
    const filteredIds = filteredRequests.map(
      (req) => req.id
    );

    const allSelected =
      filteredIds.length > 0 &&
      filteredIds.every((id) =>
        selectedIds.includes(id)
      );

    if (allSelected) {
      setSelectedIds((prev) =>
        prev.filter(
          (id) => !filteredIds.includes(id)
        )
      );
    } else {
      setSelectedIds((prev) => [
        ...new Set([
          ...prev,
          ...filteredIds,
        ]),
      ]);
    }
  };

  // =====================================
  // Delete Selected
  // =====================================

  const handleDeleteSelected = async () => {
    if (selectedIds.length === 0) return;

    const confirmed = await showAppModal(
      t("confirmDeleteSelectedRequests"),
      { type: "confirm" }
    );

    if (!confirmed) return;

    try {
      setDeletingSelected(true);

      await axiosInstance.delete(
        "/api/requests/bulk-delete",
        {
          data: {
            ids: selectedIds,
          },
        }
      );

      setRequests((prev) =>
        prev.filter(
          (req) =>
            !selectedIds.includes(req.id)
        )
      );

      setSelectedIds([]);
      setSelectionMode(false);

    } catch (err) {
      console.error(
        "Delete Selected Requests Error:",
        err
      );

      showAppModal(
        err.response?.data?.message ||
          t("failedToDeleteSelectedRequests"),
        { type: "error" }
      );
    } finally {
      setDeletingSelected(false);
    }
  };

  // =====================================
  // Main UI
  // =====================================

  return (
    <div className="admin-page" dir="rtl">

      {/* Header */}

      <div className="page-header">

        <div>
          <h2>
            {t("manageRequests")}
          </h2>
        </div>

        <div className="requests-header-actions">

          {/* Select */}

          <button
            className="select-requests-btn"
            onClick={toggleSelectionMode}
          >
            {selectionMode ? (
              <FaTimes />
            ) : (
              <FaCheckSquare />
            )}

            <span>
              {selectionMode
                ? t("cancelSelection")
                : t("select")}
            </span>
          </button>

          {/* Delete Selected */}

          {selectionMode &&
            selectedIds.length > 0 && (
              <button
                className="delete-selected-requests-btn"
                onClick={handleDeleteSelected}
                disabled={deletingSelected}
              >
                <FaTrash />

                <span>
                  {deletingSelected
                    ? t("deleting")
                    : `${t(
                        "deleteSelected"
                      )} (${selectedIds.length})`}
                </span>
              </button>
            )}

        </div>
      </div>

      {/* Search + Filter */}

      <div className="requests-toolbar">

        <div className="requests-search">

          <FaSearch />

          <input
            type="text"
            placeholder={t(
              "searchRequests"
            )}
            value={searchTerm}
            onChange={(e) =>
              setSearchTerm(
                e.target.value
              )
            }
          />

          {searchTerm && (
            <button
              type="button"
              className="clear-request-search"
              onClick={() =>
                setSearchTerm("")
              }
            >
              <FaTimes />
            </button>
          )}

        </div>

        <div className="requests-filter">

          <label>
            {t("status")}
          </label>

          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(
                e.target.value
              )
            }
          >
            <option value="all">
              {t("allRequests")}
            </option>

            <option value="pending">
              {t("Pending")}
            </option>

            <option value="approved">
              {t("Approved")}
            </option>

            <option value="rejected">
              {t("Rejected")}
            </option>
          </select>

        </div>

      </div>

      {/* Selection Toolbar */}

      {selectionMode && (
        <div className="requests-selection-toolbar">

          <label className="select-all-request-control">

            <input
              type="checkbox"
              checked={
                filteredRequests.length > 0 &&
                filteredRequests.every(
                  (req) =>
                    selectedIds.includes(
                      req.id
                    )
                )
              }
              onChange={toggleSelectAll}
            />

            <span>
              {t("selectAll")}
            </span>

          </label>

          <span className="selected-requests-count">
            {t("selectedRequests")}:{" "}
            <strong>
              {selectedIds.length}
            </strong>
          </span>

        </div>
      )}

      {/* Results */}

      <div className="requests-results-info">

        {t("showingRequests")}{" "}

        <strong>
          {filteredRequests.length}
        </strong>

        {" "}

        {t("of")}{" "}

        <strong>
          {requests.length}
        </strong>

      </div>

      {/* Table */}

      <table className="requests-table">

        <thead>

          <tr>

            {/* Checkbox ONLY when selection mode */}

            {selectionMode && (
              <th className="request-select-column">
                <span></span>
              </th>
            )}

            <th>
              {t("fullName")}
            </th>

            <th>
              {t("nationalID")}
            </th>

            <th>
              {t("service")}
            </th>

            <th>
              {t("serviceType")}
            </th>

            <th>
              {t("status")}
            </th>

            <th>
              {t("adminNotes")}
            </th>

            <th>
              {t("createdAt")}
            </th>

            <th>
              {t("actions")}
            </th>

          </tr>

        </thead>

        <tbody>

          {filteredRequests.length === 0 ? (

            <tr>

              <td
                colSpan={
                  selectionMode
                    ? 9
                    : 8
                }
                className="no-requests"
              >
                {t("noRequests")}
              </td>

            </tr>

          ) : (

            filteredRequests.map(
              (req) => (

                <tr key={req.id}>

                  {/* Selection checkbox */}

                  {selectionMode && (
                    <td
                      className="request-select-column"
                      onClick={(e) =>
                        e.stopPropagation()
                      }
                    >
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(
                          req.id
                        )}
                        onChange={() =>
                          toggleSelect(
                            req.id
                          )
                        }
                        aria-label={`${t(
                          "selectRequest"
                        )} ${
                          req.full_name ||
                          ""
                        }`}
                      />
                    </td>
                  )}

                  {/* Name */}

                  <td>
                    {req.full_name}
                  </td>

                  {/* National ID */}

                  <td>
                    {req.national_id}
                  </td>

                  {/* Service */}

                  <td>
                    {req.Service?.title ||
                      "-"}
                  </td>

                  {/* Service Type */}

                  <td>
                    {req.ServiceType?.title ||
                      "-"}
                  </td>

                  {/* Status */}

                  <td>

                    <select
                      value={req.status}
                      onChange={(e) =>
                        handleStatusChange(
                          req.id,
                          e.target.value
                        )
                      }
                    >

                      <option value="pending">
                        {t("Pending")}
                      </option>

                      <option value="approved">
                        {t("Approved")}
                      </option>

                      <option value="rejected">
                        {t("Rejected")}
                      </option>

                    </select>

                  </td>

                  {/* Admin Notes */}

                  <td>

                    <input
                      type="text"
                      placeholder={t(
                        "Admin Notes"
                      )}
                      value={
                        req.admin_notes || ""
                      }
                      onChange={(e) =>
                        handleNotesChange(
                          req.id,
                          e.target.value
                        )
                      }
                    />

                  </td>

                  {/* Date */}

                  <td>
                    {formatDateTime(
                      req.createdAt
                    )}
                  </td>

                  {/* Actions */}

                  <td>

                    <div className="actions">

                      <button
                        className="details-btn"
                        onClick={() =>
                          navigate(
                            `/admin/requests/${req.id}`
                          )
                        }
                      >
                        {t("details")}
                      </button>

                      <button
                        className="update-btn"
                        onClick={() =>
                          handleUpdate(
                            req.id
                          )
                        }
                      >
                        {t("update")}
                      </button>

                      <button
                        className="delete-re-btn"
                        onClick={() =>
                          handleDelete(
                            req.id
                          )
                        }
                      >
                        {t("delete")}
                      </button>

                    </div>

                  </td>

                </tr>

              )
            )
          )}

        </tbody>

      </table>

    </div>
  );
};

export default AdminRequests;