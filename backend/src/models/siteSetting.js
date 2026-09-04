const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const SiteSettings = sequelize.define(
  "SiteSettings",
  {
   
siteName: {
  type: DataTypes.JSONB,
  allowNull: true,
  defaultValue: {
    ar: "",
    en: ""
  }
},

description: {
  type: DataTypes.JSONB,
  allowNull: true,
  defaultValue: {
    ar: "",
    en: ""
  }
},

    logo: {
      type: DataTypes.STRING,
    },
address: {
  type: DataTypes.JSONB,
  allowNull: true,
  defaultValue: {
    ar: "",
    en: ""
  }
},

workingHours: {
  type: DataTypes.JSONB,
  allowNull: true,
  defaultValue: {
    ar: "",
    en: ""
  }
},
email: {
      type: DataTypes.STRING,
    },
phone: {
      type: DataTypes.STRING,
    },
copyright: {
  type: DataTypes.JSONB,
  allowNull: true,
  defaultValue: {
    ar: "",
    en: ""
  }
},
 whatsapp: {
      type: DataTypes.STRING,
    },
    facebook: {
      type: DataTypes.STRING,
    },

    instagram: {
      type: DataTypes.STRING,
    },

    youtube: {
      type: DataTypes.STRING,
    },

    telegram: {
      type: DataTypes.STRING,
    },

    mapUrl: {
      type: DataTypes.STRING,
    },

    latitude: {
      type: DataTypes.STRING,
    },

    longitude: {
      type: DataTypes.STRING,
    },

    mapImage: {
      type: DataTypes.STRING,
    },

    primaryColor: {
      type: DataTypes.STRING,
      defaultValue: "#004d40",
    },

    secondaryColor: {
      type: DataTypes.STRING,
      defaultValue: "#cfa23b",
    },

    navbarColor: {
      type: DataTypes.STRING,
      defaultValue: "#004d40",
    },

    footerColor: {
      type: DataTypes.STRING,
      defaultValue: "#002d26",
    },

    developerName: {
      type: DataTypes.STRING,
    },

    developerLink: {
      type: DataTypes.STRING,
    },

    updatedBy: {
  type: DataTypes.INTEGER,
  allowNull: true,
}
  },
  {
    tableName: "site_settings",
    timestamps: true,
  }
);

module.exports = SiteSettings;