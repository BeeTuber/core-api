"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("audit", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal("gen_random_uuid()"),
        primaryKey: true,
        allowNull: false,
      },
      action: {
        type: Sequelize.ENUM("CREATE", "UPDATE", "DELETE"),
        allowNull: false,
      },
      entity_type: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      entity_subtype: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      organization_id: {
        type: Sequelize.UUID,
        allowNull: false,
      },
      entity_id: {
        type: Sequelize.UUID,
        allowNull: false,
      },
      updated_by: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      request_id: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      request_ip: {
        type: Sequelize.INET,
        allowNull: true,
      },
      before: {
        type: Sequelize.JSONB,
        allowNull: true,
      },
      after: {
        type: Sequelize.JSONB,
        allowNull: true,
      },
    });

    /**
     * Indexes
     */
    await queryInterface.addIndex("audit", ["organization_id", "updated_at"]);

    /**
     * Additional checks
     */
    await queryInterface.addConstraint("audit", {
      fields: ["action", "before", "after"],
      type: "check",
      name: "action_before_after_check", // Name of the constraint
      where: Sequelize.literal(`
        (action = 'CREATE' AND before IS NULL AND after IS NOT NULL) OR
        (action = 'UPDATE' AND before IS NOT NULL AND after IS NOT NULL) OR
        (action = 'DELETE' AND before IS NOT NULL AND after IS NULL)
      `),
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("audit");
  },
};
