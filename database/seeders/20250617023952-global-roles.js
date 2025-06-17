"use strict";

const { Op } = require("sequelize");

const roleMap = [
  {
    id: "bb588713-19ef-4604-94f5-0cec1bc77b7f",
    name: "Owner",
    permissions: [
      "organization.read",
      "organization.update",
      "organization.audit",
      "roles.read",
      "roles.write",
      "users.read",
      "users.invite",
      "users.update",
      "users.delete",
      "connections.read",
      "connections.write",
      "connections.update",
      "stream-presets.read",
      "stream-presets.write",
      "stream-presets.apply",
    ],
  },

  {
    id: "b3842d88-0e52-4c0f-b16e-8bab6ad98e9f",
    name: "Editor",
    permissions: [],
  },

  {
    id: "d7b161b6-e1fb-4a49-9b87-3b8b06c14050",
    name: "Moderator",
    permissions: [],
  },
];

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // create roles
    await queryInterface.bulkInsert(
      "roles",
      roleMap.map((role) => ({
        id: role.id,
        name: role.name,
        organization_id: null,
        is_global: true,
        updated_by: "system/seed",
      })),
      {}
    );

    // create permissions
    await queryInterface.bulkInsert(
      "role_permissions",
      roleMap.flatMap((role) =>
        role.permissions.map((perm) => ({
          role_id: role.id,
          permission_id: perm,
          updated_by: "system/seed",
        }))
      ),
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    // permissions
    await queryInterface.bulkDelete(
      "role_permissions",
      {
        where: {
          role_id: {
            [Op.in]: roleMap.map((role) => role.id),
          },
        },
      },
      {}
    );

    // roles
    await queryInterface.bulkDelete(
      "roles",
      {
        where: {
          id: {
            [Op.in]: roleMap.map((role) => role.id),
          },
        },
      },
      {}
    );
  },
};
