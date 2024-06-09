/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('beed_profile_systems', {
    modified: {
      type: DataTypes.DATE,
      allowNull: true
    },
    glass_width: {
      type: DataTypes.INTEGER,
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
      primaryKey: true
    }
  }, {
    timestamps: false
  });
};
