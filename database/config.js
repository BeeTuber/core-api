require("dotenv").config();

module.exports = {
  development: {
    dialect: "postgres",
    host: process.env.DB_HOST ?? "127.0.0.1",
    database: process.env.DB_DATABASE ?? "beetuber",
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
  },
};
