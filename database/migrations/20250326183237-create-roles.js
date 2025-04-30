"use strict";

const { changelog } = require("../attributes");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("roles", {
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
        allowNull: true,
        onDelete: "CASCADE",
      },
      is_global: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      ...changelog,
    });

    await queryInterface.addConstraint("roles", {
      fields: ["organization_id", "is_global"],
      type: "check",
      name: "organization_id_required_if_not_global",
      where: {
        [Sequelize.Op.or]: [
          { is_global: true },
          { organization_id: { [Sequelize.Op.ne]: null } },
        ],
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("organization_users");
  },
};
