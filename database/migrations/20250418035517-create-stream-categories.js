"use strict";

const { changelog } = require("../attributes");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("stream_categories", {
      id: {
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal("gen_random_uuid()"),
        allowNull: false,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      twitch_id: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      igdb_id: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      ...changelog,
    });

    /**
     * Indexes
     */
    await queryInterface.addIndex("stream_categories", ["twitch_id"], {
      unique: true,
    });
    await queryInterface.addIndex("stream_categories", ["igdb_id"], {
      unique: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("stream_categories");
  },
};
