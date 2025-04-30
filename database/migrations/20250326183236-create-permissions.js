"use strict";

const { changelog } = require("../attributes");

const initialPermissions = [
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
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("permissions", {
      id: {
        primaryKey: true,
        type: Sequelize.STRING,
        allowNull: false,
      },
      ...changelog,
    });

    // insert defaults
    await queryInterface.bulkInsert(
      "permissions",
      initialPermissions.map((perm) => ({
        id: perm,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        updated_by: "system",
      }))
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("permissions");
  },
};
