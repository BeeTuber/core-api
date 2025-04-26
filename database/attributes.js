const { Sequelize } = require("sequelize");

const changelog = {
  created_at: {
    type: Sequelize.DATE,
    allowNull: false,
    defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
  },
  updated_at: {
    type: Sequelize.DATE,
    allowNull: false,
    defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
  },
  updated_by: {
    type: Sequelize.STRING,
    allowNull: false,
  },
};

module.exports = {
  changelog,
};
