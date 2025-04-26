"use strict";

const { changelog } = require("../attributes");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("stream_preset_connections", {
      connection_id: {
        primaryKey: true,
        type: Sequelize.UUID,
        references: {
          model: "connections",
          key: "id",
        },
        allowNull: false,
        onDelete: "CASCADE",
      },
      stream_preset_id: {
        primaryKey: true,
        type: Sequelize.UUID,
        references: {
          model: "stream_presets",
          key: "id",
        },
        allowNull: false,
        onDelete: "CASCADE",
      },
      ...changelog,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("stream_preset_connections");
  },
};
