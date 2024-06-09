/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('doors_groups_dependencies', {
    modified: {
      type: DataTypes.DATE,
      allowNull: false
    },
    doors_group_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    hardware_group_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true
    }
  }, {
    timestamps: false
  });
};
