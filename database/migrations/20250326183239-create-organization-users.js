"use strict";

const { changelog } = require("../attributes");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("organization_users", {
      organization_id: {
        primaryKey: true,
        type: Sequelize.UUID,
        references: {
          model: "organizations",
          key: "id",
        },
        allowNull: false,
        onDelete: "CASCADE",
      },
      user_id: {
        primaryKey: true,
        type: Sequelize.STRING,
        allowNull: false,
      },
      role_id: {
        type: Sequelize.UUID,
        references: {
          model: "roles",
          key: "id",
        },
        allowNull: false,
        onDelete: "RESTRICT",
      },
      ...changelog,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("organization_users");
  },
};
