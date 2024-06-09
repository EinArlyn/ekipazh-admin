/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('doors_hardware_items', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    hardware_group_id: {
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
    hardware_color_id: {
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
      allowNull: false,
      defaultValue: '0'
    },
    modified: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: new Date()
    }
  }, {
    timestamps: false
  });
};
