import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import {
  FaArrowLeft,
  FaArrowRight,
  FaBullseye,
  FaBuilding,
  FaCheckCircle,
  FaClock,
  FaFacebookF,
  FaGlobe,
  FaHistory,
  FaInstagram,
  FaMapMarkerAlt,
  FaPhone,
  FaTelegramPlane,
  FaYoutube,
} from "react-icons/fa";

import axiosInstance from "../api/axiosInstance";
import { API_URL } from "../config/api";

import "./About.css";

// =====================================================
// DEFAULT CONTENT
// =====================================================
// هذا المحتوى يظهر تلقائياً إذا لم يضع الأدمن قيمة.
// =====================================================

const DEFAULT_CONTENT = {
  title: {
    ar: "عن جباثا الخشب",
    en: "About Jabatha Al-Khashab",
  },

  subtitle: {
    ar: "بلديتنا",
    en: "Our Municipality",
  },

  description: {
    ar: "خدمة المواطنين، ودعم التنمية، وتعزيز التواصل مع المجتمع.",
    en: "Serving citizens, supporting local development, and strengthening communication with the community.",
  },

  communityTitle: {
    ar: "مجتمعنا",
    en: "Our Community",
  },

  communitySubtitle: {
    ar: "مجتمع يمتلك هوية ومستقبلًا",
    en: "A community with identity and a future",
  },

  communityItems: [
    {
      ar: "خدمة المجتمع المحلي",
      en: "Serving the local community",
    },
    {
      ar: "تحسين الخدمات العامة",
      en: "Improving public services",
    },
    {
      ar: "دعم التنمية المحلية",
      en: "Supporting local development",
    },
    {
      ar: "تعزيز التواصل مع المواطنين",
      en: "Strengthening communication with citizens",
    },
  ],

  historyLabel: {
    ar: "قصتنا",
    en: "Our Story",
  },

  historyTitle: {
    ar: "تاريخ البلدية",
    en: "Our Story",
  },

  history: {
    ar: "تعمل بلدية جباثا الخشب على خدمة المجتمع المحلي وتطوير الخدمات العامة وتعزيز التواصل مع المواطنين، بما يساهم في بناء مجتمع أكثر تنظيمًا واستقرارًا.",
    en: "Jabatha Al-Khashab Municipality works to serve the local community, improve public services, and strengthen communication with citizens, contributing to a more organized and sustainable community.",
  },

  visionSectionSubtitle: {
    ar: "توجهنا",
    en: "Our Direction",
  },

  visionSectionTitle: {
    ar: "الرؤية والرسالة",
    en: "Vision & Mission",
  },

  visionTitle: {
    ar: "الرؤية",
    en: "Vision",
  },

  vision: {
    ar: "أن تكون بلدية جباثا الخشب نموذجًا في تقديم الخدمات المحلية وتعزيز التنمية وتحسين جودة الحياة للمواطنين.",
    en: "To make Jabatha Al-Khashab Municipality a model for local services, development, and improving the quality of life for citizens.",
  },

  missionTitle: {
    ar: "الرسالة",
    en: "Mission",
  },

  mission: {
    ar: "تقديم خدمات بلدية فعالة وشفافة، والاستماع إلى المواطنين، ودعم المبادرات التي تساهم في تطوير المجتمع المحلي.",
    en: "Providing effective and transparent municipal services, listening to citizens, and supporting initiatives that contribute to local community development.",
  },

  valuesSectionSubtitle: {
    ar: "ما نؤمن به",
    en: "What We Believe In",
  },

  valuesSectionTitle: {
    ar: "قيمنا",
    en: "Our Values",
  },

  values: [
    {
      title: {
        ar: "المجتمع",
        en: "Community",
      },
      description: {
        ar: "وضع المواطنين والمجتمع المحلي في صميم عملنا.",
        en: "Putting citizens and the local community at the heart of our work.",
      },
    },
    {
      title: {
        ar: "التعاون",
        en: "Cooperation",
      },
      description: {
        ar: "العمل مع المواطنين والمؤسسات المحلية لتحقيق الأهداف المشتركة.",
        en: "Working with citizens and local institutions to achieve common goals.",
      },
    },
    {
      title: {
        ar: "التنمية",
        en: "Development",
      },
      description: {
        ar: "دعم المشاريع والمبادرات التي تساهم في تحسين البيئة المحلية.",
        en: "Supporting projects and initiatives that contribute to improving the local environment.",
      },
    },
    {
      title: {
        ar: "الشفافية",
        en: "Transparency",
      },
      description: {
        ar: "العمل بوضوح ومسؤولية وتعزيز الثقة مع المواطنين.",
        en: "Working clearly and responsibly while strengthening trust with citizens.",
      },
    },
  ],

  roleSectionSubtitle: {
    ar: "ماذا نقدم",
    en: "What We Do",
  },

  roleSectionTitle: {
    ar: "دور البلدية",
    en: "Municipality Role",
  },

  roles: [
    {
      title: {
        ar: "الخدمات العامة",
        en: "Public Services",
      },
      description: {
        ar: "تقديم ودعم الخدمات البلدية للمواطنين.",
        en: "Providing and supporting municipal services for citizens.",
      },
    },
    {
      title: {
        ar: "البيئة",
        en: "Environment",
      },
      description: {
        ar: "دعم الحفاظ على البيئة والنظافة والمحافظة على الأماكن العامة.",
        en: "Supporting environmental protection, cleanliness, and the preservation of public spaces.",
      },
    },
    {
      title: {
        ar: "المواطنون",
        en: "Citizens",
      },
      description: {
        ar: "الاستماع إلى المواطنين واستقبال طلباتهم وملاحظاتهم.",
        en: "Listening to citizens and receiving their requests and feedback.",
      },
    },
    {
      title: {
        ar: "الخدمات الرقمية",
        en: "Digital Services",
      },
      description: {
        ar: "تسهيل الوصول إلى المعلومات والخدمات البلدية عبر الإنترنت.",
        en: "Making municipal information and services easier to access online.",
      },
    },
  ],

  locationLabel: {
    ar: "الموقع",
    en: "Location",
  },

  locationTitle: {
    ar: "جباثا الخشب",
    en: "Jabatha Al-Khashab",
  },

  locationDescription: {
    ar: "يمكنك الوصول إلى موقع البلدية عبر خرائط Google.",
    en: "You can find the municipality location through Google Maps.",
  },

  googleMaps: {
    ar: "خرائط Google",
    en: "Google Maps",
  },

  addMap: {
    ar: "يمكنك إضافة الخريطة هنا",
    en: "You can add the map here",
  },

  viewLocation: {
    ar: "عرض الموقع على خرائط Google",
    en: "View Location on Google Maps",
  },

  contactLabel: {
    ar: "تواصل معنا",
    en: "Contact",
  },

  contactTitle: {
    ar: "ابقَ على تواصل معنا",
    en: "Get In Touch",
  },

  phone: {
    ar: "رقم الهاتف",
    en: "Phone Number",
  },

  secondaryPhone: {
    ar: "رقم الهاتف الثاني",
    en: "Secondary Phone",
  },

  email: {
    ar: "البريد الإلكتروني",
    en: "Email",
  },

  workingHours: {
    ar: "أوقات الدوام",
    en: "Working Hours",
  },

  followUs: {
    ar: "تابعنا",
    en: "Follow Us",
  },

  connectWithUs: {
    ar: "تواصل معنا",
    en: "Connect With Us",
  },

  digitalLabel: {
    ar: "البلدية الرقمية",
    en: "Digital Municipality",
  },

  digitalTitle: {
    ar: "بلديتك أقرب إليك",
    en: "Your Municipality Is Closer To You",
  },

  digitalDescription: {
    ar: "تجعل منصتنا الرقمية من السهل على المواطنين اكتشاف الخدمات البلدية، ومتابعة الأخبار والإعلانات، والوصول إلى الوسائط والتواصل مع البلدية.",
    en: "Our digital platform makes it easy for citizens to discover municipal services, follow news and announcements, access media and communicate with the municipality.",
  },

  servicesButton: {
    ar: "استكشف الخدمات",
    en: "Explore Services",
  },

  footer: {
    ar: "بلدية جباثا الخشب - خدمة المجتمع بمسؤولية والتزام.",
    en: "Jabatha Al-Khashab Municipality - Serving the community with responsibility and commitment.",
  },
};

// =====================================================
// IMAGE URL
// =====================================================

const getImageUrl = (path) => {
  if (!path) return "";

  if (
    typeof path === "string" &&
    (path.startsWith("http://") ||
      path.startsWith("https://"))
  ) {
    return path;
  }

  return `${API_URL}/${String(path).replace(/^\/+/, "")}`;
};

// =====================================================
// NORMALIZE LOCALIZED VALUE
// =====================================================

const normalizeLocalized = (value) => {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return {
      ar: "",
      en: "",
    };
  }

  if (
    typeof value === "object" &&
    !Array.isArray(value)
  ) {
    return {
      ar:
        typeof value.ar === "string"
          ? value.ar.trim()
          : "",

      en:
        typeof value.en === "string"
          ? value.en.trim()
          : "",
    };
  }

  if (typeof value === "string") {
    const trimmed = value.trim();

    if (!trimmed) {
      return {
        ar: "",
        en: "",
      };
    }

    try {
      const parsed = JSON.parse(trimmed);

      if (
        parsed &&
        typeof parsed === "object" &&
        !Array.isArray(parsed)
      ) {
        return normalizeLocalized(parsed);
      }
    } catch {
      // Normal string
    }

    return {
      ar: trimmed,
      en: "",
    };
  }

  return {
    ar: "",
    en: "",
  };
};

// =====================================================
// GET TEXT
// =====================================================
// الأولوية:
// 1. اللغة المطلوبة من الأدمن
// 2. اللغة الثانية إذا كانت موجودة
// 3. Default Content
//
// وبالتالي ما بيختفي النص عند تغيير اللغة.
// =====================================================

const getText = (
  value,
  language,
  fallback
) => {
  const localized =
    normalizeLocalized(value);

  if (localized[language]) {
    return localized[language];
  }

  const otherLanguage =
    language === "ar" ? "en" : "ar";

  if (localized[otherLanguage]) {
    return localized[otherLanguage];
  }

  if (
    fallback &&
    typeof fallback === "object"
  ) {
    return (
      fallback[language] ||
      fallback[otherLanguage] ||
      ""
    );
  }

  return fallback || "";
};

// =====================================================
// ABOUT PAGE
// =====================================================

const About = () => {
  const { i18n } = useTranslation();

  const [about, setAbout] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const language =
    i18n.resolvedLanguage === "en"
      ? "en"
      : "ar";

  const isArabic =
    language === "ar";

  // ===================================================
  // FETCH ABOUT
  // ===================================================

  useEffect(() => {
    let mounted = true;

    const fetchAbout = async () => {
      try {
        setLoading(true);

        const res =
          await axiosInstance.get(
            "/api/about"
          );

        const data =
          res.data?.about ||
          res.data;

        if (mounted) {
          setAbout(data || null);
        }
      } catch (error) {
        console.error(
          "Failed to load About:",
          error
        );

        if (mounted) {
          setAbout(null);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchAbout();

    return () => {
      mounted = false;
    };
  }, []);

  // ===================================================
  // IMAGES
  // ===================================================

  const mainImage = useMemo(
    () =>
      getImageUrl(
        about?.main_image
      ),
    [about?.main_image]
  );

  const coverImage = useMemo(
    () =>
      getImageUrl(
        about?.cover_image
      ),
    [about?.cover_image]
  );

  // ===================================================
  // GOOGLE MAP
  // ===================================================

  const mapUrl = useMemo(() => {
    if (
      !about?.latitude ||
      !about?.longitude
    ) {
      return "";
    }

    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      `${about.latitude},${about.longitude}`
    )}`;
  }, [
    about?.latitude,
    about?.longitude,
  ]);

  // ===================================================
  // LOADING
  // ===================================================

  if (loading) {
    return (
      <div className="about-loading">
        <div className="about-loading-spinner" />

        <p>
          {isArabic
            ? "جاري تحميل المعلومات..."
            : "Loading information..."}
        </p>
      </div>
    );
  }

  // ===================================================
  // PAGE
  // ===================================================

  return (
    <main
      className={`about-page ${
        isArabic ? "rtl" : "ltr"
      }`}
      dir={
        isArabic ? "rtl" : "ltr"
      }
    >
      {/* =================================================
          HERO
      ================================================= */}

      <section
        className="about-hero"
        style={
          coverImage
            ? {
                backgroundImage: `
                  linear-gradient(
                    rgba(0, 0, 0, 0.48),
                    rgba(0, 0, 0, 0.48)
                  ),
                  url("${coverImage}")
                `,
              }
            : undefined
        }
      >
        <div className="about-hero-overlay">
          <div className="about-container">
            <div className="about-hero-content">

              <span className="about-eyebrow">
                {getText(
                  about?.subtitle,
                  language,
                  DEFAULT_CONTENT.subtitle
                )}
              </span>

              <h1>
                {getText(
                  about?.title,
                  language,
                  DEFAULT_CONTENT.title
                )}
              </h1>

              <p>
                {getText(
                  about?.description,
                  language,
                  DEFAULT_CONTENT.description
                )}
              </p>

            </div>
          </div>
        </div>
      </section>

      {/* =================================================
          INTRO
      ================================================= */}

      <section className="about-intro">
        <div className="about-container">

          <div className="about-intro-grid">

            <div className="about-intro-image">
              {mainImage ? (
                <img
                  src={mainImage}
                  alt={getText(
                    about?.title,
                    language,
                    DEFAULT_CONTENT.title
                  )}
                />
              ) : (
                <div className="about-placeholder-image">
                  <FaBuilding />
                </div>
              )}
            </div>

            <div className="about-intro-content">

              <span className="about-section-label">
                {getText(
                  about?.subtitle,
                  language,
                  DEFAULT_CONTENT.subtitle
                )}
              </span>

              <h2>
                {getText(
                  about?.title,
                  language,
                  DEFAULT_CONTENT.title
                )}
              </h2>

              <p>
                {getText(
                  about?.description,
                  language,
                  DEFAULT_CONTENT.description
                )}
              </p>

              <div className="about-intro-line" />

            </div>

          </div>

        </div>
      </section>

      {/* =================================================
          COMMUNITY
      ================================================= */}

      <section className="about-community">
        <div className="about-container">

          <div className="about-section-heading">

            <span>
              {getText(
                about?.subtitle,
                language,
                DEFAULT_CONTENT.subtitle
              )}
            </span>

            <h2>
              {
                DEFAULT_CONTENT
                  .communityTitle[
                    language
                  ]
              }
            </h2>

            <p>
              {
                DEFAULT_CONTENT
                  .communitySubtitle[
                    language
                  ]
              }
            </p>

          </div>

          <div className="about-community-grid">

            {DEFAULT_CONTENT.communityItems.map(
              (item, index) => (
                <div
                  className="about-community-item"
                  key={index}
                >
                  <span className="about-item-number">
                    {String(
                      index + 1
                    ).padStart(2, "0")}
                  </span>

                  <FaCheckCircle />

                  <h3>
                    {item[language]}
                  </h3>
                </div>
              )
            )}

          </div>

        </div>
      </section>

      {/* =================================================
          HISTORY
      ================================================= */}

      {about?.show_history !==
        false && (
        <section className="about-history">
          <div className="about-container">

            <div className="about-section-heading">

              <span>
                {
                  DEFAULT_CONTENT
                    .historyLabel[
                      language
                    ]
                }
              </span>

              <h2>
                {
                  DEFAULT_CONTENT
                    .historyTitle[
                      language
                    ]
                }
              </h2>

            </div>

            <div className="about-history-content">

              <div className="about-history-icon">
                <FaHistory />
              </div>

              <div>
                <p>
                  {getText(
                    about?.history,
                    language,
                    DEFAULT_CONTENT.history
                  )}
                </p>
              </div>

            </div>

          </div>
        </section>
      )}

      {/* =================================================
          VISION / MISSION
      ================================================= */}

      {(about?.show_vision !==
        false ||
        about?.show_mission !==
          false) && (
        <section className="about-vision">
          <div className="about-container">

            <div className="about-section-heading light">

              <span>
                {
                  DEFAULT_CONTENT
                    .visionSectionSubtitle[
                      language
                    ]
                }
              </span>

              <h2>
                {
                  DEFAULT_CONTENT
                    .visionSectionTitle[
                      language
                    ]
                }
              </h2>

            </div>

            <div className="about-vision-grid">

              {about?.show_vision !==
                false && (
                <article className="about-vision-card">

                  <div className="about-card-icon">
                    <FaBullseye />
                  </div>

                  <h3>
                    {
                      DEFAULT_CONTENT
                        .visionTitle[
                          language
                        ]
                    }
                  </h3>

                  <p>
                    {getText(
                      about?.vision,
                      language,
                      DEFAULT_CONTENT.vision
                    )}
                  </p>

                </article>
              )}

              {about?.show_mission !==
                false && (
                <article className="about-vision-card">

                  <div className="about-card-icon">
                    <FaCheckCircle />
                  </div>

                  <h3>
                    {
                      DEFAULT_CONTENT
                        .missionTitle[
                          language
                        ]
                    }
                  </h3>

                  <p>
                    {getText(
                      about?.mission,
                      language,
                      DEFAULT_CONTENT.mission
                    )}
                  </p>

                </article>
              )}

            </div>

          </div>
        </section>
      )}

      {/* =================================================
          VALUES
      ================================================= */}

      {about?.show_values !==
        false && (
        <section className="about-values">
          <div className="about-container">

            <div className="about-section-heading">

              <span>
                {
                  DEFAULT_CONTENT
                    .valuesSectionSubtitle[
                      language
                    ]
                }
              </span>

              <h2>
                {
                  DEFAULT_CONTENT
                    .valuesSectionTitle[
                      language
                    ]
                }
              </h2>

            </div>

            <div className="about-values-grid">

              {DEFAULT_CONTENT.values.map(
                (item, index) => (
                  <article
                    className="about-value-card"
                    key={index}
                  >

                    <span className="about-value-number">
                      {String(
                        index + 1
                      ).padStart(2, "0")}
                    </span>

                    <h3>
                      {item.title[language]}
                    </h3>

                    <p>
                      {item.description[
                        language
                      ]}
                    </p>

                  </article>
                )
              )}

            </div>

          </div>
        </section>
      )}

      {/* =================================================
          MUNICIPALITY ROLE
      ================================================= */}

      <section className="about-role">
        <div className="about-container">

          <div className="about-section-heading">

            <span>
              {
                DEFAULT_CONTENT
                  .roleSectionSubtitle[
                    language
                  ]
              }
            </span>

            <h2>
              {
                DEFAULT_CONTENT
                  .roleSectionTitle[
                    language
                  ]
              }
            </h2>

          </div>

          <div className="about-role-grid">

            {DEFAULT_CONTENT.roles.map(
              (item, index) => (
                <article
                  className="about-role-card"
                  key={index}
                >

                  <div className="about-role-icon">

                    {index === 0 && (
                      <FaBuilding />
                    )}

                    {index === 1 && (
                      <FaGlobe />
                    )}

                    {index === 2 && (
                      <FaPhone />
                    )}

                    {index === 3 && (
                      <FaGlobe />
                    )}

                  </div>

                  <h3>
                    {item.title[
                      language
                    ]}
                  </h3>

                  <p>
                    {item.description[
                      language
                    ]}
                  </p>

                </article>
              )
            )}

          </div>

        </div>
      </section>

      {/* =================================================
          LOCATION
      ================================================= */}

      <section className="about-location">
        <div className="about-container">

          <div className="about-location-grid">

            <div className="about-location-content">

              <span className="about-section-label">
                {
                  DEFAULT_CONTENT
                    .locationLabel[
                      language
                    ]
                }
              </span>

              <h2>
                {getText(
                  about?.location,
                  language,
                  DEFAULT_CONTENT.locationTitle
                )}
              </h2>

              <p>
                {
                  DEFAULT_CONTENT
                    .locationDescription[
                      language
                    ]
                }
              </p>

              {about?.address && (
                <div className="about-contact-row">

                  <FaMapMarkerAlt />

                  <span>
                    {getText(
                      about.address,
                      language,
                      ""
                    )}
                  </span>

                </div>
              )}

              {mapUrl && (
                <a
                  href={mapUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="about-map-button"
                >

                  {isArabic ? (
                    <>
                      <FaMapMarkerAlt />

                      {
                        DEFAULT_CONTENT
                          .viewLocation
                          .ar
                      }
                    </>
                  ) : (
                    <>
                      {
                        DEFAULT_CONTENT
                          .viewLocation
                          .en
                      }

                      <FaMapMarkerAlt />
                    </>
                  )}

                </a>
              )}

            </div>

            <div className="about-map-placeholder">

              <FaMapMarkerAlt />

              <h3>
                {
                  DEFAULT_CONTENT
                    .googleMaps[
                      language
                    ]
                }
              </h3>

              <p>
                {
                  DEFAULT_CONTENT
                    .addMap[
                      language
                    ]
                }
              </p>

            </div>

          </div>

        </div>
      </section>

      {/* =================================================
          CONTACT
      ================================================= */}

      {about?.show_contact !==
        false && (
        <section className="about-contact">
          <div className="about-container">

            <div className="about-section-heading">

              <span>
                {
                  DEFAULT_CONTENT
                    .contactLabel[
                      language
                    ]
                }
              </span>

              <h2>
                {
                  DEFAULT_CONTENT
                    .contactTitle[
                      language
                    ]
                }
              </h2>

            </div>

            <div className="about-contact-grid">

              {about?.phone && (
                <a
                  href={`tel:${about.phone}`}
                  className="about-contact-card"
                >

                  <FaPhone />

                  <div>

                    <span>
                      {
                        DEFAULT_CONTENT
                          .phone[
                            language
                          ]
                      }
                    </span>

                    <strong>
                      {about.phone}
                    </strong>

                  </div>

                </a>
              )}

              {about?.secondary_phone && (
                <a
                  href={`tel:${about.secondary_phone}`}
                  className="about-contact-card"
                >

                  <FaPhone />

                  <div>

                    <span>
                      {
                        DEFAULT_CONTENT
                          .secondaryPhone[
                            language
                          ]
                      }
                    </span>

                    <strong>
                      {
                        about.secondary_phone
                      }
                    </strong>

                  </div>

                </a>
              )}

              {about?.email && (
                <a
                  href={`mailto:${about.email}`}
                  className="about-contact-card"
                >

                  <FaGlobe />

                  <div>

                    <span>
                      {
                        DEFAULT_CONTENT
                          .email[
                            language
                          ]
                      }
                    </span>

                    <strong>
                      {about.email}
                    </strong>

                  </div>

                </a>
              )}

              {(about?.working_hours ||
                about?.working_days) && (
                <div className="about-contact-card">

                  <FaClock />

                  <div>

                    <span>
                      {
                        DEFAULT_CONTENT
                          .workingHours[
                            language
                          ]
                      }
                    </span>

                    {about?.working_hours && (
                      <strong>
                        {getText(
                          about.working_hours,
                          language,
                          ""
                        )}
                      </strong>
                    )}

                    {about?.working_days && (
                      <small>
                        {getText(
                          about.working_days,
                          language,
                          ""
                        )}
                      </small>
                    )}

                  </div>

                </div>
              )}

            </div>

          </div>
        </section>
      )}

      {/* =================================================
          SOCIAL MEDIA
      ================================================= */}

      {about?.show_social_media !==
        false && (
        <section className="about-social">
          <div className="about-container">

            <div className="about-social-content">

              <span>
                {
                  DEFAULT_CONTENT
                    .followUs[
                      language
                    ]
                }
              </span>

              <h2>
                {
                  DEFAULT_CONTENT
                    .connectWithUs[
                      language
                    ]
                }
              </h2>

              <div className="about-social-links">

                {about?.facebook_url && (
                  <a
                    href={
                      about.facebook_url
                    }
                    target="_blank"
                    rel="noreferrer"
                    aria-label="Facebook"
                  >
                    <FaFacebookF />
                  </a>
                )}

                {about?.instagram_url && (
                  <a
                    href={
                      about.instagram_url
                    }
                    target="_blank"
                    rel="noreferrer"
                    aria-label="Instagram"
                  >
                    <FaInstagram />
                  </a>
                )}

                {about?.youtube_url && (
                  <a
                    href={
                      about.youtube_url
                    }
                    target="_blank"
                    rel="noreferrer"
                    aria-label="YouTube"
                  >
                    <FaYoutube />
                  </a>
                )}

                {about?.telegram_url && (
                  <a
                    href={
                      about.telegram_url
                    }
                    target="_blank"
                    rel="noreferrer"
                    aria-label="Telegram"
                  >
                    <FaTelegramPlane />
                  </a>
                )}

                {about?.whatsapp_number && (
                  <a
                    href={`https://wa.me/${String(
                      about.whatsapp_number
                    ).replace(
                      /\D/g,
                      ""
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="WhatsApp"
                  >
                    <FaPhone />
                  </a>
                )}

              </div>

            </div>

          </div>
        </section>
      )}

      {/* =================================================
          DIGITAL MUNICIPALITY
      ================================================= */}

      <section className="about-digital">
        <div className="about-container">

          <div className="about-digital-content">

            <span>
              {
                DEFAULT_CONTENT
                  .digitalLabel[
                    language
                  ]
              }
            </span>

            <h2>
              {
                DEFAULT_CONTENT
                  .digitalTitle[
                    language
                  ]
              }
            </h2>

            <p>
              {
                DEFAULT_CONTENT
                  .digitalDescription[
                    language
                  ]
              }
            </p>

            <a
              href="/services"
              className="about-services-button"
            >

              {
                DEFAULT_CONTENT
                  .servicesButton[
                    language
                  ]
              }

              {isArabic ? (
                <FaArrowLeft />
              ) : (
                <FaArrowRight />
              )}

            </a>

          </div>

        </div>
      </section>

      {/* =================================================
          BOTTOM
      ================================================= */}

      <div className="about-bottom">
        <div className="about-container">

          <p>
            {
              DEFAULT_CONTENT.footer[
                language
              ]
            }
          </p>

        </div>
      </div>

    </main>
  );
};

export default About;