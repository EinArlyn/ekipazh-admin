/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('window_hardwares', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true
    },
    window_hardware_type_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    min_width: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: '0'
    },
    max_width: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: '0'
    },
    min_height: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: '0'
    },
    max_height: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: '0'
    },
    direction_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    window_hardware_color_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    length: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    count: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    child_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    child_type: {
      type: DataTypes.ENUM('list', 'element'),
      allowNull: false
    },
    position: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    factory_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    window_hardware_group_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    modified: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: '2014-12-17 13:05:12.231386+00'
    },
    rules_type: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    timestamps: false
  });
};
