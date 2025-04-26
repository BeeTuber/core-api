"use strict";

const { changelog } = require("../attributes");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("connections", {
      id: {
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal("gen_random_uuid()"),
        allowNull: false,
      },
      organization_id: {
        primaryKey: false,
        type: Sequelize.UUID,
        references: {
          model: "organizations",
          key: "id",
        },
        allowNull: false,
        onDelete: "CASCADE",
      },
      type: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      token_expires_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      ...changelog,
    });

    await queryInterface.addIndex("connections", ["organization_id"]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("connections");
  },
};
