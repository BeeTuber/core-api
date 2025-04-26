"use strict";

const { changelog } = require("../attributes");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("stream_presets", {
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
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      tags: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        defaultValue: [],
        allowNull: false,
      },
      category_id: {
        primaryKey: false,
        type: Sequelize.UUID,
        references: {
          model: "stream_categories",
          key: "id",
        },
        allowNull: true,
        onDelete: "SET NULL",
      },
      ...changelog,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("stream_presets");
  },
};
