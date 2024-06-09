/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('window_hardware_profile_systems', {
    modified: {
      type: DataTypes.DATE,
      allowNull: true
    },
    window_hardware_group_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    profile_system_id: {
      type: DataTypes.INTEGER,
      allowNull: true
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
