import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  FaCheckCircle,
  FaExclamationCircle,
  FaQuestionCircle,
  FaTimes,
} from "react-icons/fa";
import "./AppModal.css";

const MODAL_EVENT = "app-modal:open";

const AppModal = () => {
  const { t } = useTranslation();
  const [modal, setModal] = useState(null);

  useEffect(() => {
    const handleOpen = (event) => {
      setModal((currentModal) => {
        currentModal?.resolve(false);
        return event.detail;
      });
    };
    window.addEventListener(MODAL_EVENT, handleOpen);

    return () => window.removeEventListener(MODAL_EVENT, handleOpen);
  }, []);

  useEffect(() => {
    if (!modal) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") closeModal(false);
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [modal]);

  const closeModal = (result) => {
    modal?.resolve(result);
    setModal(null);
  };

  if (!modal) return null;

  const isError = modal.type === "error";
  const isConfirmation = modal.type === "confirm";

  return (
    <div
      className="app-modal-backdrop"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) closeModal(false);
      }}
    >
      <section
        className="app-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="app-modal-title"
      >
        <button
          className="app-modal-close"
          type="button"
          onClick={() => closeModal(false)}
          aria-label={t("close")}
        >
          <FaTimes aria-hidden="true" />
        </button>

        <div className={`app-modal-icon ${isError ? "is-error" : isConfirmation ? "is-confirm" : "is-success"}`}>
          {isError ? (
            <FaExclamationCircle aria-hidden="true" />
          ) : isConfirmation ? (
            <FaQuestionCircle aria-hidden="true" />
          ) : (
            <FaCheckCircle aria-hidden="true" />
          )}
        </div>

        <h2 id="app-modal-title">
          {modal.title || t(isError ? "error" : isConfirmation ? "confirmAction" : "success")}
        </h2>
        <p>{modal.message}</p>

        <div className="app-modal-actions">
          {isConfirmation && (
            <button
              className="app-modal-cancel"
              type="button"
              onClick={() => closeModal(false)}
            >
              {t("cancel")}
            </button>
          )}
          <button
            className="app-modal-confirm"
            type="button"
            onClick={() => closeModal(true)}
          >
            {t("confirm")}
          </button>
        </div>
      </section>
    </div>
  );
};

export default AppModal;
