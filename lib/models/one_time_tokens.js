var Sequelize = require("sequelize");

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('one_time_tokens', {
    token: {
      type: DataTypes.TEXT,
      allowNull: false,
      primaryKey: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      },
      onDelete: 'CASCADE'
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    },
    expires_at: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
    tableName: 'one_time_tokens',
    timestamps: false
  });
};