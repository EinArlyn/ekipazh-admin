/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('list_contents', {
    rounding_value: {
      type: 'NUMERIC',
      allowNull: true
    },
    rounding_type: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    modified: {
      type: DataTypes.DATE,
      allowNull: true
    },
    lamination_type_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    window_hardware_color_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    direction_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    rules_type_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    value: {
      type: 'NUMERIC',
      allowNull: false
    },
    child_type: {
      type: DataTypes.ENUM('list', 'element'),
      allowNull: false
    },
    child_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    parent_list_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    }
  }, {
    timestamps: false
  });
};
