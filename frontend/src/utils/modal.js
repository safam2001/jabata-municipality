export const showAppModal = (message, options = {}) => {
  return new Promise((resolve) => {
    window.dispatchEvent(
      new CustomEvent("app-modal:open", {
        detail: {
          message,
          type: options.type || "info",
          resolve,
        },
      })
    );
  });
};
