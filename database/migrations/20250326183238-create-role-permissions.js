"use strict";

const { changelog } = require("../attributes");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("role_permissions", {
      role_id: {
        primaryKey: true,
        type: Sequelize.UUID,
        references: {
          model: "roles",
          key: "id",
        },
        allowNull: false,
        onDelete: "CASCADE",
      },
      permission_id: {
        primaryKey: true,
        type: Sequelize.STRING,
        references: {
          model: "permissions",
          key: "id",
        },
        allowNull: false,
        onDelete: "CASCADE",
      },
      ...changelog,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("organization_users");
  },
};
