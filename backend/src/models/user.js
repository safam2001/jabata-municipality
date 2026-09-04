const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const bcrypt = require("bcrypt");

const User = sequelize.define(
  "User",
  {
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "N/A",
    },

    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "N/A",
    },

    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },

    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    role: {
      type: DataTypes.ENUM("user", "admin"),
      defaultValue: "user",
    },

    phone: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    isBlocked: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },

    blockedUntil: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    timestamps: true,
  }
);


// 🔐 Hash password (BEST PRACTICE)
User.beforeSave(async (user) => {
  if (user.changed("password")) {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
  }
});


// 🔑 Compare Password method
User.prototype.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

module.exports = User;
