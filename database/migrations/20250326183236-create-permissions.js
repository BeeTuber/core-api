"use strict";

const { changelog } = require("../attributes");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("permissions", {
      id: {
        primaryKey: true,
        type: Sequelize.STRING,
        allowNull: false,
      },
      ...changelog,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("permissions");
  },
};
