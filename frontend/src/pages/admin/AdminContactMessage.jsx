
import React, { useEffect, useMemo, useState } from "react";
import {
  FaEnvelope,
  FaEnvelopeOpen,
  FaReply,
  FaTrash,
  FaEye,
  FaSearch,
  FaPhone,
  FaUser,
  FaCalendarAlt,
  FaTimes,
  FaCheck,
  FaSyncAlt,
  FaInbox,
  FaCheckSquare,
  FaSquare,
} from "react-icons/fa";

import axiosInstance from "../../api/axiosInstance";
import { useTranslation } from "react-i18next";
import "./AdminContactMessage.css";

const AdminContactMessages = () => {
  const { t, i18n } = useTranslation();

  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [selectedContact, setSelectedContact] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  // =====================================
  // Selection
  // =====================================

  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [deletingSelected, setDeletingSelected] = useState(false);

  // =====================================
  // Fetch Contacts
  // =====================================

  const fetchContacts = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const response = await axiosInstance.get("/api/contacts");

      setContacts(
        Array.isArray(response.data) ? response.data : []
      );
    } catch (err) {
      console.error("Fetch Contact Messages Error:", err);

      setError(
        err.response?.data?.message ||
          t("failedToFetchContactMessages")
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  // =====================================
  // Statistics
  // =====================================

  const statistics = useMemo(() => {
    return {
      total: contacts.length,

      newMessages: contacts.filter(
        (contact) => contact.status === "new"
      ).length,

      readMessages: contacts.filter(
        (contact) => contact.status === "read"
      ).length,

      repliedMessages: contacts.filter(
        (contact) => contact.status === "replied"
      ).length,
    };
  }, [contacts]);

  // =====================================
  // Search + Filter
  // =====================================

  const filteredContacts = useMemo(() => {
    return contacts.filter((contact) => {
      const search = searchTerm.toLowerCase().trim();

      const matchesSearch =
        !search ||
        contact.name?.toLowerCase().includes(search) ||
        contact.email?.toLowerCase().includes(search) ||
        contact.phone?.toLowerCase().includes(search) ||
        contact.subject?.toLowerCase().includes(search) ||
        contact.message?.toLowerCase().includes(search);

      const matchesStatus =
        statusFilter === "all" ||
        contact.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [contacts, searchTerm, statusFilter]);

  // =====================================
  // Selection Functions
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

  const toggleSelect = (id) => {
    setSelectedIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((itemId) => itemId !== id);
      }

      return [...prev, id];
    });
  };

  const toggleSelectAll = () => {
    const filteredIds = filteredContacts.map(
      (contact) => contact.id
    );

    const allSelected =
      filteredIds.length > 0 &&
      filteredIds.every((id) =>
        selectedIds.includes(id)
      );

    if (allSelected) {
      setSelectedIds((prev) =>
        prev.filter((id) => !filteredIds.includes(id))
      );
    } else {
      setSelectedIds((prev) => [
        ...new Set([...prev, ...filteredIds]),
      ]);
    }
  };

  // =====================================
  // Delete Selected
  // =====================================

  const handleDeleteSelected = async () => {
    if (selectedIds.length === 0) return;

    const confirmed = window.confirm(
      t("confirmDeleteSelectedContactMessages")
    );

    if (!confirmed) return;

    try {
      setDeletingSelected(true);

      await Promise.all(
        selectedIds.map((id) =>
          axiosInstance.delete(`/api/contacts/${id}`)
        )
      );

      setContacts((prev) =>
        prev.filter(
          (contact) => !selectedIds.includes(contact.id)
        )
      );

      setSelectedIds([]);
      setSelectionMode(false);

      if (
        selectedContact &&
        selectedIds.includes(selectedContact.id)
      ) {
        handleCloseDetails();
      }
    } catch (err) {
      console.error(
        "Delete Selected Contact Messages Error:",
        err
      );

      alert(
        err.response?.data?.message ||
          t("failedToDeleteSelectedContactMessages")
      );
    } finally {
      setDeletingSelected(false);
    }
  };

  // =====================================
  // Status Label
  // =====================================

  const getStatusLabel = (status) => {
    switch (status) {
      case "new":
        return t("contactStatusNew");

      case "read":
        return t("contactStatusRead");

      case "replied":
        return t("contactStatusReplied");

      default:
        return t("unknown");
    }
  };

  // =====================================
  // Status Class
  // =====================================

  const getStatusClass = (status) => {
    switch (status) {
      case "new":
        return "status-new";

      case "read":
        return "status-read";

      case "replied":
        return "status-replied";

      default:
        return "";
    }
  };

  // =====================================
  // Format Date
  // =====================================

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleString(
      i18n.language === "ar" ? "ar" : "en-US",
      {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }
    );
  };

  // =====================================
  // Open Details
  // =====================================

  const handleOpenDetails = async (contact) => {
    setSelectedContact(contact);
    setShowDetails(true);

    if (contact.status === "new") {
      try {
        await axiosInstance.put(
          `/api/contacts/${contact.id}/status`,
          {
            status: "read",
          }
        );

        setContacts((prev) =>
          prev.map((item) =>
            item.id === contact.id
              ? {
                  ...item,
                  status: "read",
                }
              : item
          )
        );

        setSelectedContact((prev) =>
          prev
            ? {
                ...prev,
                status: "read",
              }
            : prev
        );
      } catch (err) {
        console.error(
          "Update Contact Status Error:",
          err
        );
      }
    }
  };

  // =====================================
  // Close Details
  // =====================================

  const handleCloseDetails = () => {
    setShowDetails(false);
    setSelectedContact(null);
  };

  // =====================================
  // Change Status
  // =====================================

  const handleChangeStatus = async (id, status) => {
    try {
      setUpdatingStatus(true);

      await axiosInstance.put(
        `/api/contacts/${id}/status`,
        {
          status,
        }
      );

      setContacts((prev) =>
        prev.map((contact) =>
          contact.id === id
            ? {
                ...contact,
                status,
              }
            : contact
        )
      );

      setSelectedContact((prev) =>
        prev
          ? {
              ...prev,
              status,
            }
          : prev
      );
    } catch (err) {
      console.error(
        "Change Contact Status Error:",
        err
      );

      alert(
        err.response?.data?.message ||
          t("failedToUpdateContactStatus")
      );
    } finally {
      setUpdatingStatus(false);
    }
  };

  // =====================================
  // Delete Contact
  // =====================================

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      t("confirmDeleteContactMessage")
    );

    if (!confirmed) return;

    try {
      setDeletingId(id);

      await axiosInstance.delete(
        `/api/contacts/${id}`
      );

      setContacts((prev) =>
        prev.filter(
          (contact) => contact.id !== id
        )
      );

      setSelectedIds((prev) =>
        prev.filter((itemId) => itemId !== id)
      );

      if (selectedContact?.id === id) {
        handleCloseDetails();
      }
    } catch (err) {
      console.error(
        "Delete Contact Error:",
        err
      );

      alert(
        err.response?.data?.message ||
          t("failedToDeleteContactMessage")
      );
    } finally {
      setDeletingId(null);
    }
  };

  // =====================================
  // Loading
  // =====================================

  if (loading) {
    return (
      <div
        className="admin-contact-page"
        dir="rtl"
      >
        <div className="contact-loading">
          <div className="loading-spinner"></div>

          <p>
            {t("loadingContactMessages")}
          </p>
        </div>
      </div>
    );
  }

  // =====================================
  // Main UI
  // =====================================

  return (
    <div
      className="admin-contact-page"
      dir="rtl"
    >
      {/* Header */}

      <div className="contact-page-header">

        <div className="contact-header-content">

          <div className="contact-header-icon">
            <FaEnvelope />
          </div>

          <div>
            <h1>
              {t("contactMessages")}
            </h1>

            <p>
              {t(
                "contactMessagesDescription"
              )}
            </p>
          </div>

        </div>

        <div className="contact-header-actions">

          <button
            className="contact-select-btn"
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

          {selectionMode &&
            selectedIds.length > 0 && (
              <button
                className="contact-delete-selected-btn"
                onClick={handleDeleteSelected}
                disabled={deletingSelected}
              >
                <FaTrash />

                <span>
                  {deletingSelected
                    ? t("deleting")
                    : `${t("deleteSelected")} (${selectedIds.length})`}
                </span>
              </button>
            )}

          <button
            className="contact-refresh-btn"
            onClick={() =>
              fetchContacts(true)
            }
            disabled={refreshing}
          >
            <FaSyncAlt
              className={
                refreshing
                  ? "refresh-spinning"
                  : ""
              }
            />

            <span>
              {t("refresh")}
            </span>
          </button>

        </div>

      </div>

      {/* Selection Toolbar */}

      {selectionMode && (
        <div className="selection-toolbar">

          <label
            className="select-all-control"
            onClick={(e) =>
              e.stopPropagation()
            }
          >
            <input
              type="checkbox"
              checked={
                filteredContacts.length > 0 &&
                filteredContacts.every((contact) =>
                  selectedIds.includes(contact.id)
                )
              }
              onChange={toggleSelectAll}
            />

            <span>
              {t("selectAll")}
            </span>
          </label>

          <span className="selected-count">
            {t("selectedMessages")}:{" "}
            <strong>
              {selectedIds.length}
            </strong>
          </span>

        </div>
      )}

      {/* Error */}

      {error && (
        <div className="contact-error">

          <span>{error}</span>

          <button
            onClick={() =>
              fetchContacts()
            }
          >
            {t("retry")}
          </button>

        </div>
      )}

      {/* Statistics */}

      <div className="contact-statistics">

        <div className="contact-stat-card">

          <div className="stat-icon stat-icon-total">
            <FaInbox />
          </div>

          <div className="stat-info">

            <span>
              {t("contactStatsTotal")}
            </span>

            <strong>
              {statistics.total}
            </strong>

          </div>

        </div>

        <div className="contact-stat-card">

          <div className="stat-icon stat-icon-new">
            <FaEnvelope />
          </div>

          <div className="stat-info">

            <span>
              {t("contactStatsNew")}
            </span>

            <strong>
              {statistics.newMessages}
            </strong>

          </div>

        </div>

        <div className="contact-stat-card">

          <div className="stat-icon stat-icon-read">
            <FaEnvelopeOpen />
          </div>

          <div className="stat-info">

            <span>
              {t("contactStatsRead")}
            </span>

            <strong>
              {statistics.readMessages}
            </strong>

          </div>

        </div>

        <div className="contact-stat-card">

          <div className="stat-icon stat-icon-replied">
            <FaReply />
          </div>

          <div className="stat-info">

            <span>
              {t("contactStatsReplied")}
            </span>

            <strong>
              {statistics.repliedMessages}
            </strong>

          </div>

        </div>

      </div>

      {/* Toolbar */}

      <div className="contact-toolbar">

        <div className="contact-search">

          <FaSearch />

          <input
            type="text"
            placeholder={t(
              "searchContactMessages"
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
              className="clear-search"
              onClick={() =>
                setSearchTerm("")
              }
              type="button"
            >
              <FaTimes />
            </button>
          )}

        </div>

        <div className="contact-filter">

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
              {t("allContactMessages")}
            </option>

            <option value="new">
              {t("contactStatusNew")}
            </option>

            <option value="read">
              {t("contactStatusRead")}
            </option>

            <option value="replied">
              {t("contactStatusReplied")}
            </option>

          </select>

        </div>

      </div>

      {/* Results */}

      <div className="contact-results-info">

        <span>
          {t("showingContactMessages")}{" "}
          <strong>
            {filteredContacts.length}
          </strong>{" "}
          {t("of")}{" "}
          <strong>
            {contacts.length}
          </strong>
        </span>

      </div>

      {/* Empty */}

      {filteredContacts.length === 0 ? (

        <div className="contact-empty">

          <div className="empty-icon">
            <FaEnvelope />
          </div>

          <h3>
            {contacts.length === 0
              ? t("noContactMessages")
              : t("noContactSearchResults")}
          </h3>

          <p>
            {contacts.length === 0
              ? t(
                  "noContactMessagesDescription"
                )
              : t("changeSearchOrFilter")}
          </p>

          {contacts.length > 0 &&
            (searchTerm ||
              statusFilter !== "all") && (
              <button
                className="clear-filters-btn"
                onClick={() => {
                  setSearchTerm("");
                  setStatusFilter("all");
                }}
              >
                {t("clearFilters")}
              </button>
            )}

        </div>

      ) : (

        <div className="contact-table-wrapper">

          <table className="contact-table">

            <thead>

              <tr>

                {/* Checkbox column appears ONLY in selection mode */}

                {selectionMode && (
                  <th className="select-column">
                    <span></span>
                  </th>
                )}

                <th>
                  {t("sender")}
                </th>

                <th>
                  {t("subject")}
                </th>

                <th>
                  {t("phone")}
                </th>

                <th>
                  {t("date")}
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

              {filteredContacts.map(
                (contact) => (

                  <tr
                    key={contact.id}
                    className={
                      contact.status === "new"
                        ? "new-message-row"
                        : ""
                    }
                  >

                    {/* ONE checkbox for the WHOLE message */}

                    {selectionMode && (
                      <td
                        className="select-column"
                        onClick={(e) =>
                          e.stopPropagation()
                        }
                      >
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(
                            contact.id
                          )}
                          onChange={() =>
                            toggleSelect(
                              contact.id
                            )
                          }
                          aria-label={`${t(
                            "selectMessage"
                          )} ${contact.name || ""}`}
                        />
                      </td>
                    )}

                    {/* Sender */}

                    <td>

                      <div className="sender-cell">

                        <div className="sender-avatar">
                          <FaUser />
                        </div>

                        <div className="sender-info">

                          <strong>
                            {contact.name || "-"}
                          </strong>

                          <span>
                            {contact.email || "-"}
                          </span>

                        </div>

                      </div>

                    </td>

                    {/* Subject */}

                    <td>

                      <div className="subject-cell">

                        <strong>
                          {contact.subject ||
                            t("noSubject")}
                        </strong>

                        <span>
                          {contact.message
                            ? contact.message
                                .length > 60
                              ? `${contact.message.substring(
                                  0,
                                  60
                                )}...`
                              : contact.message
                            : "-"}
                        </span>

                      </div>

                    </td>

                    {/* Phone */}

                    <td>

                      <div className="phone-cell">

                        {contact.phone ? (
                          <>
                            <FaPhone />

                            <span>
                              {contact.phone}
                            </span>
                          </>
                        ) : (
                          <span className="no-data">
                            {t(
                              "notAvailable"
                            )}
                          </span>
                        )}

                      </div>

                    </td>

                    {/* Date */}

                    <td>

                      <div className="date-cell">

                        <FaCalendarAlt />

                        <span>
                          {formatDate(
                            contact.createdAt
                          )}
                        </span>

                      </div>

                    </td>

                    {/* Status */}

                    <td>

                      <span
                        className={`contact-status ${getStatusClass(
                          contact.status
                        )}`}
                      >

                        <span className="status-dot"></span>

                        {getStatusLabel(
                          contact.status
                        )}

                      </span>

                    </td>

                    {/* Actions */}

                    <td>

                      <div className="contact-actions">

                        <button
                          className="action-btn view-btn"
                          title={t(
                            "viewMessage"
                          )}
                          onClick={() =>
                            handleOpenDetails(
                              contact
                            )
                          }
                        >
                          <FaEye />
                        </button>

                        <button
                          className="action-btn delete-btn"
                          title={t(
                            "deleteMessage"
                          )}
                          disabled={
                            deletingId ===
                            contact.id
                          }
                          onClick={() =>
                            handleDelete(
                              contact.id
                            )
                          }
                        >
                          {deletingId ===
                          contact.id ? (
                            <span className="mini-spinner"></span>
                          ) : (
                            <FaTrash />
                          )}
                        </button>

                      </div>

                    </td>

                  </tr>

                )
              )}

            </tbody>

          </table>

        </div>
      )}

      {/* Details Modal */}

      {showDetails &&
        selectedContact && (

          <div
            className="contact-modal-overlay"
            onClick={
              handleCloseDetails
            }
          >

            <div
              className="contact-modal"
              onClick={(e) =>
                e.stopPropagation()
              }
            >

              <div className="contact-modal-header">

                <div>

                  <div className="modal-title-icon">
                    <FaEnvelope />
                  </div>

                  <div>

                    <h2>
                      {t(
                        "contactMessageDetails"
                      )}
                    </h2>

                    <span>
                      {t(
                        "messageNumber"
                      )}{" "}
                      #{selectedContact.id}
                    </span>

                  </div>

                </div>

                <button
                  className="modal-close-btn"
                  onClick={
                    handleCloseDetails
                  }
                  title={t("close")}
                >
                  <FaTimes />
                </button>

              </div>

              <div className="contact-modal-body">

                <div className="details-section">

                  <div className="details-section-title">

                    <FaUser />

                    <h3>
                      {t(
                        "senderInformation"
                      )}
                    </h3>

                  </div>

                  <div className="sender-details-grid">

                    <div className="detail-item">

                      <span>
                        {t("name")}
                      </span>

                      <strong>
                        {selectedContact.name ||
                          "-"}
                      </strong>

                    </div>

                    <div className="detail-item">

                      <span>
                        {t("email")}
                      </span>

                      <a
                        href={`mailto:${selectedContact.email}`}
                      >
                        {selectedContact.email ||
                          "-"}
                      </a>

                    </div>

                    <div className="detail-item">

                      <span>
                        {t("phone")}
                      </span>

                      {selectedContact.phone ? (
                        <a
                          href={`tel:${selectedContact.phone}`}
                        >
                          {selectedContact.phone}
                        </a>
                      ) : (
                        <strong className="muted-text">
                          {t(
                            "notAvailable"
                          )}
                        </strong>
                      )}

                    </div>

                    <div className="detail-item">

                      <span>
                        {t("sentDate")}
                      </span>

                      <strong>
                        {formatDate(
                          selectedContact.createdAt
                        )}
                      </strong>

                    </div>

                  </div>

                </div>

                <div className="details-section">

                  <div className="details-section-title">

                    <FaEnvelopeOpen />

                    <h3>
                      {t(
                        "messageContent"
                      )}
                    </h3>

                  </div>

                  <div className="message-details">

                    <div className="message-subject">

                      <span>
                        {t("subject")}
                      </span>

                      <h3>
                        {selectedContact.subject ||
                          t("noSubject")}
                      </h3>

                    </div>

                    <div className="message-content">

                      {selectedContact.message ||
                        "-"}

                    </div>

                  </div>

                </div>

                <div className="details-section">

                  <div className="details-section-title">

                    <FaCheck />

                    <h3>
                      {t(
                        "messageStatus"
                      )}
                    </h3>

                  </div>

                  <div className="status-management">

                    <button
                      className={`status-option ${
                        selectedContact.status ===
                        "new"
                          ? "active new-option"
                          : ""
                      }`}
                      disabled={
                        updatingStatus
                      }
                      onClick={() =>
                        handleChangeStatus(
                          selectedContact.id,
                          "new"
                        )
                      }
                    >

                      <FaEnvelope />

                      <span>
                        {t(
                          "contactStatusNew"
                        )}
                      </span>

                    </button>

                    <button
                      className={`status-option ${
                        selectedContact.status ===
                        "read"
                          ? "active read-option"
                          : ""
                      }`}
                      disabled={
                        updatingStatus
                      }
                      onClick={() =>
                        handleChangeStatus(
                          selectedContact.id,
                          "read"
                        )
                      }
                    >

                      <FaEnvelopeOpen />

                      <span>
                        {t(
                          "contactStatusRead"
                        )}
                      </span>

                    </button>

                    <button
                      className={`status-option ${
                        selectedContact.status ===
                        "replied"
                          ? "active replied-option"
                          : ""
                      }`}
                      disabled={
                        updatingStatus
                      }
                      onClick={() =>
                        handleChangeStatus(
                          selectedContact.id,
                          "replied"
                        )
                      }
                    >

                      <FaReply />

                      <span>
                        {t(
                          "contactStatusReplied"
                        )}
                      </span>

                    </button>

                  </div>

                </div>

              </div>

              <div className="contact-modal-footer">

                <button
                  className="modal-delete-btn"
                  onClick={() =>
                    handleDelete(
                      selectedContact.id
                    )
                  }
                  disabled={
                    deletingId ===
                    selectedContact.id
                  }
                >

                  <FaTrash />

                  {deletingId ===
                  selectedContact.id
                    ? t("deleting")
                    : t(
                        "deleteMessage"
                      )}

                </button>

                <button
                  className="modal-close-secondary"
                  onClick={
                    handleCloseDetails
                  }
                >
                  {t("close")}
                </button>

              </div>

            </div>

          </div>
        )}

    </div>
  );
};

export default AdminContactMessages;

