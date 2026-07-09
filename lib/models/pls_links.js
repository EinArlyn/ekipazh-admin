/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('pls_links', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    parent_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    element_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    rules_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    rules_value: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    parent_type_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
  }, {
    timestamps: false
  });
};
