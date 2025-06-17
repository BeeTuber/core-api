"use strict";

const { Op } = require("sequelize");

const permissions = [
  "organization.read",
  "organization.update",
  "organization.audit",

  // auth
  "roles.read",
  "roles.write",
  "users.read",
  "users.invite",
  "users.update",
  "users.delete",

  // connections
  "connections.read",
  "connections.write",
  "connections.update",

  // stream presets
  "stream-presets.read",
  "stream-presets.write",
  "stream-presets.apply",
];

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "permissions",
      permissions.map((perm) => ({
        id: perm,
        updated_by: "system/seed",
      })),
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete(
      "permissions",
      {
        where: {
          role_id: {
            [Op.in]: permissions,
          },
        },
      },
      {}
    );
  },
};
