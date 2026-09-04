import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import ar from "./locales/ar.json";
import en from "./locales/en.json";

const savedLanguage = localStorage.getItem("language") || "ar";

i18n
  .use(initReactI18next)
  .init({
    resources: {
      ar: {
        translation: ar,
      },
      en: {
        translation: en,
      },
    },

    lng: savedLanguage,
    fallbackLng: "ar",

    interpolation: {
      escapeValue: false,
    },
  });

const updateDocumentLanguage = (language) => {
  document.documentElement.lang = language;
  document.documentElement.dir = language === "ar" ? "rtl" : "ltr";

  localStorage.setItem("language", language);
};

updateDocumentLanguage(savedLanguage);

i18n.on("languageChanged", (language) => {
  updateDocumentLanguage(language);
});

export default i18n;