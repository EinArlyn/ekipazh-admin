/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('lists_profile_systems', {
    modified: {
      type: DataTypes.DATE,
      allowNull: true
    },
    list_id: {
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
