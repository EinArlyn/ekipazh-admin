/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('profile_curve_rules', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    profile_systems_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    min_radius_frame: {
      type: 'NUMERIC',
      allowNull: true
    },
    min_radius_sash: {
      type: 'NUMERIC',
      allowNull: true
    },
    min_radius_impost: {
      type: 'NUMERIC',
      allowNull: true
    },
    min_corner_frame: {
      type: 'NUMERIC',
      allowNull: true
    },
    min_corner_sash: {
      type: 'NUMERIC',
      allowNull: true
    },
    min_corner_impost: {
      type: 'NUMERIC',
      allowNull: true
    },
  }, {
    timestamps: false
  });
};
