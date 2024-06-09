/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('window_hardware', {
    modified: {
      type: DataTypes.DATE,
      allowNull: true
    },
    window_hardware_group_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    factory_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    position: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    child_type: {
      type: DataTypes.ENUM('list', 'element'),
      allowNull: false
    },
    child_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    count: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    length: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    window_hardware_color_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    direction_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    max_height: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: '0'
    },
    min_height: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: '0'
    },
    max_width: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: '0'
    },
    min_width: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: '0'
    },
    window_hardware_type_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    }
  }, {
    timestamps: false
  });
};
