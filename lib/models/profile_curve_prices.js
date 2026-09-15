/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('profile_curve_prices', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    profile_systems_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    currency_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    arc_frame_price: {
      type: 'NUMERIC',
      allowNull: true
    },
    arc_sash_price: {
      type: 'NUMERIC',
      allowNull: true
    },
    arc_impost_price: {
      type: 'NUMERIC',
      allowNull: true
    },
    corner_frame_price: {
      type: 'NUMERIC',
      allowNull: true
    },
    corner_sash_price: {
      type: 'NUMERIC',
      allowNull: true
    },
    corner_impost_price: {
      type: 'NUMERIC',
      allowNull: true
    },
    corner_not_four_price: {
      type: 'NUMERIC',
      allowNull: true
    },
  }, {
    timestamps: false
  });
};
