/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('rules_types', {
    modified: {
      type: DataTypes.DATE,
      allowNull: true
    },
    suffix: {
      type: DataTypes.STRING,
      allowNull: true
    },
    child_unit: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    parent_unit: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true
    },
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    }
  }, {
    timestamps: false
  });
};
