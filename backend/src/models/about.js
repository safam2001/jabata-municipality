const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const About = sequelize.define(
  "About",
  {
    // =========================================
    // BASIC INFORMATION
    // =========================================

    title: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: {
        ar: "",
        en: "",
      },
    },

    description: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: {
        ar: "",
        en: "",
      },
    },

    subtitle: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: {
        ar: "",
        en: "",
      },
    },

    // =========================================
    // HISTORY
    // =========================================

    history: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: {
        ar: "",
        en: "",
      },
    },

    // =========================================
    // VISION & MISSION
    // =========================================

    vision: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: {
        ar: "",
        en: "",
      },
    },

    mission: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: {
        ar: "",
        en: "",
      },
    },

    // =========================================
    // VALUES
    // =========================================

    values: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: {
        ar: "",
        en: "",
      },
    },

    // =========================================
    // LOCATION
    // =========================================

    location: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: {
        ar: "",
        en: "",
      },
    },

    address: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: {
        ar: "",
        en: "",
      },
    },

    latitude: {
      type: DataTypes.DECIMAL(10, 7),
      allowNull: true,
    },

    longitude: {
      type: DataTypes.DECIMAL(10, 7),
      allowNull: true,
    },

    // =========================================
    // CONTACT INFORMATION
    // =========================================

    phone: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    secondary_phone: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    email: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isEmail: true,
      },
    },

    website: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    // =========================================
    // WORKING HOURS
    // =========================================

    working_hours: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: {
        ar: "",
        en: "",
      },
    },

    working_days: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: {
        ar: "",
        en: "",
      },
    },

    // =========================================
    // IMAGES / BRANDING
    // =========================================


    // =========================================
    // SOCIAL MEDIA
    // =========================================

    facebook_url: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    instagram_url: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    youtube_url: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    telegram_url: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    whatsapp_number: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    // =========================================
    // PAGE SETTINGS
    // =========================================

    status: {
      type: DataTypes.ENUM(
        "active",
        "inactive"
      ),
      allowNull: false,
      defaultValue: "active",
    },

    // =========================================
    // DISPLAY SETTINGS
    // =========================================

    show_history: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },

    show_vision: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },

    show_mission: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },

    show_values: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },

    show_contact: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },

    show_social_media: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },

    // =========================================
    // SEO
    // =========================================

    meta_title: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: {
        ar: "",
        en: "",
      },
    },

    meta_description: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: {
        ar: "",
        en: "",
      },
    },

    // =========================================
    // ORDER
    // =========================================

    display_order: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
  },

  {
    tableName: "abouts",
    timestamps: true,
  }
);

module.exports = About;
