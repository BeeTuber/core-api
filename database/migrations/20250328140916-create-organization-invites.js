"use strict";

const { changelog } = require("../attributes");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("organization_invites", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal("gen_random_uuid()"),
        primaryKey: true,
        allowNull: false,
      },
      organization_id: {
        type: Sequelize.UUID,
        references: {
          model: "organizations",
          key: "id",
        },
        allowNull: false,
        onDelete: "CASCADE",
      },
      role_id: {
        type: Sequelize.UUID,
        references: {
          model: "roles",
          key: "id",
        },
        allowNull: false,
        onDelete: "CASCADE",
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      expires_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      ...changelog,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("organization_invites");
  },
};
