const { Sequelize } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize(
  process.env.DB_NAME || "e_utilities_cost",
  process.env.DB_USER || "app_user",
  process.env.DB_PASSWORD || "changeme",
  {
    host: process.env.DB_HOST || "mariadb",
    port: process.env.DB_PORT || 3306,
    dialect: "mariadb",
    logging: process.env.NODE_ENV === "development" ? console.log : false,
    define: {
      underscored: true,
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  }
);

module.exports = sequelize;
