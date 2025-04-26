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
      role: {
        type: Sequelize.ENUM,
        values: ["owner", "admin", "editor", "moderator"],
        allowNull: false,
      },
      is_default: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      is_pending: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      ...changelog,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("organization_users");
  },
};
